import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./src/firebase.ts";
import { collection, doc, query, where, getDocs, getDoc, setDoc, updateDoc, orderBy, limit as firestoreLimit } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily
  let aiClient: GoogleGenAI | null = null;
  function getAi() {
    if (!aiClient) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
      }
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const usersRef = await getDocs(query(collection(db, "users"), where("email", "==", email)));
      if (usersRef.empty) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const userDoc = usersRef.docs[0];
      const userData = userDoc.data();
      if (userData.password === password) {
        res.json({ user: { id: userDoc.id, ...userData } });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const usersRef = await getDocs(query(collection(db, "users"), where("email", "==", email)));
      if (!usersRef.empty) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const id = uuidv4();
      const now = Date.now();
      await setDoc(doc(db, "users", id), {
        userId: id,
        name,
        email,
        password,
        role,
        status: "approved",
        createdAt: now,
        updatedAt: now
      });

      if (role === 'va' || role === 'worker') {
        await setDoc(doc(db, "va_profiles", id), {
          userId: id,
          createdAt: now,
          updatedAt: now
        });
      } else if (role === 'employer') {
        await setDoc(doc(db, "employer_profiles", id), {
          userId: id,
          company_name: name,
          createdAt: now,
          updatedAt: now
        });
      }

      const newUser = await getDoc(doc(db, "users", id));
      res.json({ user: { id: newUser.id, ...newUser.data() } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobsSnap = await getDocs(query(collection(db, "jobs"), where("status", "==", "approved")));

      const jobs = [];
      for (const d of jobsSnap.docs) {
        const job: any = { id: d.id, ...d.data() };
        if (job.deletedAt) continue;
        if (job.employerId) {
          const empDoc = await getDoc(doc(db, "employer_profiles", job.employerId));
          if (empDoc.exists()) {
            job.company_name = empDoc.data()?.company_name;
            job.logo_url = empDoc.data()?.logo_url;
            job.company_description = empDoc.data()?.company_description;
          }
        }
        jobs.push(job);
      }
      jobs.sort((a, b) => {
        if (b.is_featured !== a.is_featured) return b.is_featured ? 1 : -1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
      res.json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobDoc = await getDoc(doc(db, "jobs", req.params.id));
      if (!jobDoc.exists()) return res.status(404).json({ error: "Job not found" });

      const job: any = { id: jobDoc.id, ...jobDoc.data() };
      if (job.deletedAt) return res.status(404).json({ error: "Job not found" });
      if (job.employerId) {
        const empDoc = await getDoc(doc(db, "employer_profiles", job.employerId));
        if (empDoc.exists()) {
          job.company_name = empDoc.data()?.company_name;
          job.logo_url = empDoc.data()?.logo_url;
          job.company_description = empDoc.data()?.company_description;
        }
      }
      res.json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    const { job_id, va_id, cover_letter } = req.body;
    try {
      const id = uuidv4();
      await setDoc(doc(db, "applications", id), {
        applicationId: id,
        jobId: job_id,
        vaId: va_id,
        cover_letter,
        status: "applied",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      res.json({ id });
    } catch (err) {
      res.status(400).json({ error: "Application failed" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    const { employer_id, title, description, salary_min, salary_max, job_type, experience_level, expiry_date } = req.body;
    try {
      const id = uuidv4();
      await setDoc(doc(db, "jobs", id), {
        jobId: id,
        employerId: employer_id,
        title,
        description,
        salary_min,
        salary_max,
        job_type,
        experience_level,
        status: "approved",
        expiry_date,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null
      });
      res.json({ id });
    } catch (err) {
      res.status(400).json({ error: "Failed to create job" });
    }
  });

  // Employer Dashboard Routes
  app.get("/api/employer/jobs/:employerId", async (req, res) => {
    try {
      const jobsSnap = await getDocs(query(collection(db, "jobs"), where("employerId", "==", req.params.employerId)));
      
      const jobs: any[] = [];
      for (const d of jobsSnap.docs) {
        const job = { id: d.id, ...d.data() as any };
        if (job.deletedAt) continue;
        const appsSnap = await getDocs(query(collection(db, "applications"), where("jobId", "==", d.id)));
        job.application_count = appsSnap.size;
        jobs.push(job);
      }
      jobs.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });

  app.get("/api/employer/applications/:employerId", async (req, res) => {
    try {
      const jobsSnap = await getDocs(query(collection(db, "jobs"), where("employerId", "==", req.params.employerId)));
      const jobIds = jobsSnap.docs.map(d => d.id);
      if (jobIds.length === 0) return res.json([]);
      
      const apps: any[] = [];
      const chunks = [];
      for(let i=0; i<jobIds.length; i+=10) chunks.push(jobIds.slice(i, i+10));
      
      for (const chunk of chunks) {
        const appsSnap = await getDocs(query(collection(db, "applications"), where("jobId", "in", chunk)));
        for (const d of appsSnap.docs) {
          const appData: any = { id: d.id, ...d.data() };
          const vaDoc = await getDoc(doc(db, "users", appData.vaId));
          if (vaDoc.exists()) {
            appData.va_name = vaDoc.data()?.name;
            appData.va_email = vaDoc.data()?.email;
          }
          const jobDoc = jobsSnap.docs.find(jd => jd.id === appData.jobId);
          appData.job_title = jobDoc ? jobDoc.data()?.title : "Unknown Job";
          apps.push(appData);
        }
      }
      apps.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
      res.json(apps);
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });

  app.get("/api/employer/profile/:userId", async (req, res) => {
    try {
      const profileDoc = await getDoc(doc(db, "employer_profiles", req.params.userId));
      const userDoc = await getDoc(doc(db, "users", req.params.userId));
      if (!profileDoc.exists()) {
         await setDoc(doc(db, "employer_profiles", req.params.userId), {
           userId: req.params.userId,
           company_name: userDoc.exists() ? userDoc.data()?.name : "",
           createdAt: Date.now(),
           updatedAt: Date.now()
         });
         return res.json({
           userId: req.params.userId,
           name: userDoc.exists() ? userDoc.data()?.name : "",
           email: userDoc.exists() ? userDoc.data()?.email : ""
         });
      }
      res.json({
        ...profileDoc.data(),
        name: userDoc.exists() ? userDoc.data()?.name : "",
        email: userDoc.exists() ? userDoc.data()?.email : ""
      });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });

  app.post("/api/employer/profile", async (req, res) => {
    const { id, company_name, website, industry, company_description, logo_url } = req.body;
    try {
      await setDoc(doc(db, "employer_profiles", id), {
        company_name: company_name || "",
        website: website || "",
        industry: industry || "",
        company_description: company_description || "",
        logo_url: logo_url || "",
        updatedAt: Date.now()
      }, { merge: true });
      await updateDoc(doc(db, "users", id), { name: company_name, updatedAt: Date.now() });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });

  // Admin middleware and stats
  const requireAdmin = async (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists() || (userDoc.data()?.role !== 'admin' && userDoc.data()?.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.adminId = userId;
    next();
  };

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    res.json({
      totalUsers: { count: 3 },
      totalVAs: { count: 1 },
      totalEmployers: { count: 1 },
      totalJobs: { count: 3 },
      activeJobs: { count: 3 },
      pendingJobs: { count: 0 },
      activeSubscriptions: { count: 0 },
      monthlyRevenue: { total: 0 },
      pendingReports: { count: 0 }
    });
  });

  app.get("/api/admin/jobs", requireAdmin, async (req, res) => {
    try {
      const jobsSnap = await getDocs(collection(db, "jobs"));
      const jobs: any[] = [];
      for (const d of jobsSnap.docs) {
        const job = { id: d.id, ...d.data() as any };
        if (job.employerId) {
           const empDoc = await getDoc(doc(db, "employer_profiles", job.employerId));
           if(empDoc.exists()) job.company_name = empDoc.data()?.company_name;
        }
        jobs.push(job);
      }
      jobs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });

  // Admin Job Approvals
  app.post("/api/admin/approve-job", requireAdmin, async (req, res) => {
    try {
      await updateDoc(doc(db, "jobs", req.body.id), { status: "approved", updatedAt: Date.now() });
      await setDoc(doc(db, "admin_logs", uuidv4()), { admin_id: (req as any).adminId, action_type: 'job_approved', description: 'Approved job '+req.body.id, created_at: Date.now() });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/admin/reject-job", requireAdmin, async (req, res) => {
    try {
      await updateDoc(doc(db, "jobs", req.body.id), { status: "rejected", rejection_reason: req.body.reason, updatedAt: Date.now() });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/admin/toggle-featured-job", requireAdmin, async (req, res) => {
     try {
      await updateDoc(doc(db, "jobs", req.body.id), { is_featured: req.body.is_featured ? true : false, updatedAt: Date.now() });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
     try {
      const snap = await getDocs(collection(db, "users"));
      const users = snap.docs.map(d => ({id: d.id, ...d.data()}));
      res.json(users);
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/admin/update-user-status", requireAdmin, async (req, res) => {
     try {
      await updateDoc(doc(db, "users", req.body.id), { status: req.body.status, updatedAt: Date.now() });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.delete("/api/admin/delete-user", requireAdmin, async (req, res) => {
     try {
      await updateDoc(doc(db, "users", req.body.id), { deletedAt: Date.now() });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.get("/api/admin/logs", requireAdmin, async (req, res) => {
    res.json([]);
  });

  app.get("/api/admin/payments", requireAdmin, async (req, res) => { res.json([]); });
  app.get("/api/admin/reports", requireAdmin, async (req, res) => { res.json([]); });
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => { res.json({ userGrowth: [], revenue: [] }); });
  app.get("/api/admin/subscriptions", requireAdmin, async (req, res) => { res.json([]); });

  // Talents
  app.get("/api/talents", async (req, res) => {
    try {
       const uSnap = await getDocs(collection(db, "users"));
       const approvedUsers = uSnap.docs.filter(d => (d.data().status === "approved" || d.data().role === "worker" || d.data().role === "va") && !d.data().deletedAt).map(d => ({id: d.id, ...d.data() as any}));
       const userIds = approvedUsers.map(u => u.id);
       
       if (userIds.length === 0) return res.json([]);

       const profiles: any[] = [];
       const chunks = [];
       for(let i=0; i<userIds.length; i+=10) chunks.push(userIds.slice(i, i+10));
       
       for(const chunk of chunks) {
         const pSnap = await getDocs(query(collection(db, "va_profiles"), where("userId", "in", chunk)));
         for(const doc of pSnap.docs) {
           const pData = doc.data();
           if(pData.deletedAt) continue;
           const user = approvedUsers.find(u => u.id === pData.userId);
           if(user) {
             profiles.push({ ...pData, name: user.name, email: user.email, skills: pData.skills || [] });
           }
         }
       }
       res.json(profiles);
    } catch(err) {
       res.status(500).json({error: "Failed"});
    }
  });

  app.get("/api/subscriptions", async (req, res) => {
    res.json({ plan_name: 'Free', job_post_limit: 3 });
  });

  app.post("/api/subscriptions/upgrade", async (req, res) => { res.json({ success: true }); });

  app.get("/api/employer/applications", async (req, res) => { res.json([]); });

  app.post("/api/hire", async (req, res) => {
     try {
       await updateDoc(doc(db, "applications", req.body.application_id), { status: 'hired', updatedAt: Date.now() });
       res.json({success: true});
     } catch(e) {}
  });

  app.post("/api/unhire", async (req, res) => {
     try {
       await updateDoc(doc(db, "applications", req.body.application_id), { status: 'shortlisted', updatedAt: Date.now() });
       res.json({success: true});
     } catch(e) {}
  });

  // VA Profile
  app.get("/api/va/profile/:userId", async (req, res) => {
     try {
       const profileDoc = await getDoc(doc(db, "va_profiles", req.params.userId));
       const userDoc = await getDoc(doc(db, "users", req.params.userId));
       if(!profileDoc.exists()) return res.status(404).json({error: "Not found"});
       
       res.json({
         ...profileDoc.data(),
         name: userDoc.exists() ? userDoc.data()?.name : "",
         email: userDoc.exists() ? userDoc.data()?.email : "",
         skills: profileDoc.data()?.skills || []
       });
     } catch(e) {res.status(500).json({error: "Failed"});}
  });

  app.post("/api/va/profile", async (req, res) => {
     const data = req.body;
     try {
       await setDoc(doc(db, "va_profiles", data.user_id), {
         ...data,
         updatedAt: Date.now()
       }, { merge: true });
       res.json({success: true});
     } catch(e) {res.status(500).json({error: "Failed"});}
  });

  app.post("/api/va/payment", async (req, res) => {
     try {
       await updateDoc(doc(db, "va_profiles", req.body.user_id), {
         paypal_email: req.body.paypal_email,
         wise_account: req.body.wise_account,
         updatedAt: Date.now()
       });
       res.json({success: true});
     } catch(e) {res.status(500).json({error: "Failed"});}
  });

  // Messages
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const uid = req.params.userId;
      const snap1 = await getDocs(query(collection(db, "messages"), where("senderId", "==", uid)));
      const snap2 = await getDocs(query(collection(db, "messages"), where("receiverId", "==", uid)));
      const msgs = [...snap1.docs, ...snap2.docs].map(d => ({id: d.id, ...d.data() as any}));
      
      const uniqueMsgs = [];
      const seen = new Set();
      for(const m of msgs) {
        if(!seen.has(m.id)) {
          seen.add(m.id);
          
          let sDoc = await getDoc(doc(db, "users", m.senderId));
          let rDoc = await getDoc(doc(db, "users", m.receiverId));
          m.sender_name = sDoc.exists() ? sDoc.data()?.name : "";
          m.receiver_name = rDoc.exists() ? rDoc.data()?.name : "";
          
          uniqueMsgs.push(m);
        }
      }
      uniqueMsgs.sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0));
      res.json(uniqueMsgs);
    } catch(e) { res.status(500).json({error: "Failed"}); }
  });

  app.post("/api/messages", async (req, res) => {
     try {
       const id = uuidv4();
       await setDoc(doc(db, "messages", id), {
         messageId: id,
         senderId: req.body.sender_id,
         receiverId: req.body.receiver_id,
         message_body: req.body.message_body,
         createdAt: Date.now()
       });
       res.json({id});
     } catch(e) {res.status(500).json({error: "Failed"});}
  });

  // AI Matching Routes
  app.get("/api/ai/match-jobs/:vaId", async (req, res) => {
    try {
      const ai = getAi();
      const profileDoc = await getDoc(doc(db, "va_profiles", req.params.vaId));
      const userDoc = await getDoc(doc(db, "users", req.params.vaId));
      if(!profileDoc.exists()) return res.json([]);
      const vaProfile = {
        name: userDoc.exists() ? userDoc.data()?.name : "",
        headline: profileDoc.data()?.headline || "",
        bio: profileDoc.data()?.bio || "",
        skills: profileDoc.data()?.skills || []
      };

      const jobsSnap = await getDocs(query(collection(db, "jobs"), where("status", "==", "approved")));
      const jobs = jobsSnap.docs.map(d => ({id: d.id, ...d.data() as any})).filter((j: any) => !j.deletedAt);
      if(jobs.length === 0) return res.json([]);

      const prompt = `Match the following Virtual Assistant profile with the best jobs from the dataset.
      VA Profile: ${JSON.stringify(vaProfile)}
      Available Jobs: ${JSON.stringify(jobs.map(j => ({title: j.title, desc: j.description, type: j.job_type, id: j.id})))}
      Find top 5. Return JSON array format: [{"job_id": "", "match_score": 95, "reasoning": ""}]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 job_id: { type: Type.STRING },
                 match_score: { type: Type.NUMBER },
                 reasoning: { type: Type.STRING }
               },
               required: ["job_id", "match_score", "reasoning"]
             }
          }
        }
      });

      const parsedMatches = JSON.parse(response.text || "[]");
      const enrichedMatches = parsedMatches.map((m: any) => {
        const job = jobs.find(j => j.id === m.job_id);
        return { ...m, job };
      }).filter((m: any) => m.job != null).sort((a: any, b: any) => b.match_score - a.match_score);
      
      res.json(enrichedMatches);
    } catch(e) {res.json([]);}
  });

  app.get("/api/ai/match-candidates/:jobId", async (req, res) => {
     try {
       const ai = getAi();
       const jobDoc = await getDoc(doc(db, "jobs", req.params.jobId));
       if(!jobDoc.exists()) return res.json([]);
       
       const uSnap = await getDocs(collection(db, "users"));
       const uIds = uSnap.docs.filter(u => u.data()?.status === "approved" && !u.data()?.deletedAt).map(u => u.id);
       
       const candidates = [];
       for(const uid of uIds) {
         const p = await getDoc(doc(db, "va_profiles", uid));
         if(p.exists() && !p.data()?.deletedAt) {
           candidates.push({
             id: uid,
             name: uSnap.docs.find(d => d.id === uid)?.data()?.name || "",
             headline: p.data()?.headline || "",
             bio: p.data()?.bio || "",
             skills: p.data()?.skills || []
           });
         }
       }

       const prompt = `Match best candidates for Job: Title: ${jobDoc.data()?.title}, Desc: ${jobDoc.data()?.description}
       Candidates Pool: ${JSON.stringify(candidates)}
       Find top 5. Return JSON array format: [{"va_id": "", "match_score": 95, "reasoning": ""}]`;

       const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 va_id: { type: Type.STRING },
                 match_score: { type: Type.NUMBER },
                 reasoning: { type: Type.STRING }
               },
               required: ["va_id", "match_score", "reasoning"]
             }
          }
        }
      });
      
      const parsedMatches = JSON.parse(response.text || "[]");
      const enrichedMatches = parsedMatches.map((m: any) => {
        const candidate = candidates.find(c => c.id === m.va_id);
        return { ...m, candidate };
      }).filter((m: any) => m.candidate != null).sort((a: any, b: any) => b.match_score - a.match_score);
      res.json(enrichedMatches);
     } catch(e) {res.json([]);}
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
  });
}

startServer();
