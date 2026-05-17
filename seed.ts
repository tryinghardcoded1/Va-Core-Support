import { db } from './src/firebase.ts';
import { collection, doc, setDoc, getDocs, limit, query } from 'firebase/firestore';

async function seed() {
  const usersCountSnap = await getDocs(query(collection(db, "users"), limit(1)));
  if(usersCountSnap.size > 0) {
    console.log("Firestore already seeded!");
    return;
  }
  
  console.log("Seeding Firestore...");
  const now = Date.now();

  const adminId = 'admin-1';
  await setDoc(doc(db, 'users', adminId), {
    userId: adminId,
    role: 'SUPER_ADMIN',
    name: 'System Admin',
    email: 'admin@vahub.com',
    password: 'Memyselfandi!1',
    status: 'approved',
    createdAt: now,
    updatedAt: now
  });

  const empId = 'employer-demo-1';
  await setDoc(doc(db, 'users', empId), {
    userId: empId,
    role: 'employer',
    name: 'Demo Employer',
    email: 'emp@demo.com',
    password: 'empdemo',
    status: 'approved',
    createdAt: now,
    updatedAt: now
  });
  await setDoc(doc(db, 'employer_profiles', empId), {
    userId: empId,
    company_name: 'Demo Corp',
    industry: 'Technology',
    createdAt: now,
    updatedAt: now
  });

  const vaId = 'va-demo-1';
  await setDoc(doc(db, 'users', vaId), {
    userId: vaId,
    role: 'worker',
    name: 'Demo VA',
    email: 'va@demo.com',
    password: 'vademo',
    status: 'approved',
    createdAt: now,
    updatedAt: now
  });
  await setDoc(doc(db, 'va_profiles', vaId), {
    userId: vaId,
    headline: 'Expert Virtual Assistant',
    bio: 'I am a demo VA profile with extensive experience in administrative tasks.',
    hourly_rate: 15,
    monthly_salary: 2400,
    education: 'Bachelors degree',
    availability: 'full-time work (8 hours/day)',
    id_proof_score: 80,
    skills: [
      { skill_name: 'Administration', years_experience: '2 - 5 years' }
    ],
    createdAt: now,
    updatedAt: now
  });

  const jobsData = [
    { id: 'j1', title: 'Warm-Call Appointment Setter - Remote', desc: 'Are you a great communicator who enjoys talking to people and making a positive impact?', min: 1000, max: 1200, type: 'Full-Time', featured: true },
    { id: 'j2', title: 'Full-Time Remote Sales Specialist', desc: 'We are looking for a full-time chat-based Sales Specialist.', min: 800, max: 2500, type: 'Full-Time', featured: true },
    { id: 'j3', title: 'Assistant for Property Management', desc: 'We are seeking an organized Assistant.', min: 650, max: 900, type: 'Full-Time', featured: false }
  ];

  for(const job of jobsData) {
    await setDoc(doc(db, 'jobs', job.id), {
      jobId: job.id,
      employerId: empId,
      title: job.title,
      description: job.desc,
      salary_min: job.min,
      salary_max: job.max,
      job_type: job.type,
      experience_level: 'Intermediate',
      status: 'approved',
      is_featured: job.featured,
      createdAt: now,
      updatedAt: now,
      skills: ['Sales', 'Customer Support', 'Administration']
    });
  }

  console.log("Firestore Seed Complete!");
}

seed().catch(console.error);
