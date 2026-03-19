import React, { useState, useEffect } from 'react';
import { Users, Briefcase, CreditCard, DollarSign, AlertCircle, Database, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../supabaseClient';

export default function DashboardOverview({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [user.id]);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const seedSampleJobs = async () => {
    setSeeding(true);
    const sampleJobs = [
      {
        title: "Senior Virtual Assistant",
        company_name: "TechFlow Solutions",
        description: "We are looking for an experienced VA to handle executive scheduling, email management, and basic project coordination. Must be proficient in Google Workspace and Slack.",
        salary_min: 800,
        salary_max: 1200,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Executive Support", "Email Management", "Scheduling"],
        status: "approved",
        is_featured: true,
        employer_id: user.id,
        company_description: "A leading tech consultancy based in Singapore."
      },
      {
        title: "Social Media Manager",
        company_name: "Creative Pulse",
        description: "Manage multiple Instagram and TikTok accounts for our e-commerce clients. Create content calendars, engage with followers, and track analytics.",
        salary_min: 600,
        salary_max: 900,
        job_type: "Part-time",
        experience_level: "Intermediate",
        skills: ["Instagram", "TikTok", "Content Creation"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Digital marketing agency specializing in lifestyle brands."
      },
      {
        title: "Customer Support Representative",
        company_name: "Global Reach Inc.",
        description: "Provide high-quality support via Zendesk and live chat. Shift work required. Excellent English communication skills are a must.",
        salary_min: 500,
        salary_max: 800,
        job_type: "Full-time",
        experience_level: "Entry-level",
        skills: ["Zendesk", "Customer Service", "English Proficiency"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "BPO company serving US and European markets."
      },
      {
        title: "Lead Generation Specialist",
        company_name: "SalesForce Pro",
        description: "Identify and qualify leads using LinkedIn Sales Navigator and Apollo. Build outreach lists and manage initial email sequences.",
        salary_min: 700,
        salary_max: 1100,
        job_type: "Full-time",
        experience_level: "Intermediate",
        skills: ["LinkedIn", "Lead Generation", "Email Outreach"],
        status: "approved",
        is_featured: true,
        employer_id: user.id,
        company_description: "Sales acceleration firm for SaaS startups."
      },
      {
        title: "E-commerce Store Manager",
        company_name: "Swift Shop",
        description: "Manage Shopify store operations, product listings, and order fulfillment coordination. Experience with Oberlo or DSers is a plus.",
        salary_min: 900,
        salary_max: 1400,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Shopify", "Inventory Management", "Dropshipping"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Fast-growing dropshipping enterprise."
      },
      {
        title: "Graphic Designer (Canva Expert)",
        company_name: "Brand Boost",
        description: "Create stunning social media graphics, presentations, and marketing materials using Canva. Must have a strong eye for design and typography.",
        salary_min: 600,
        salary_max: 1000,
        job_type: "Contract",
        experience_level: "Intermediate",
        skills: ["Canva", "Graphic Design", "Branding"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Boutique branding agency."
      },
      {
        title: "Data Entry Clerk",
        company_name: "InfoStream",
        description: "Accurately enter data from physical documents into our digital database. High attention to detail and fast typing speed required.",
        salary_min: 400,
        salary_max: 600,
        job_type: "Full-time",
        experience_level: "Entry-level",
        skills: ["Data Entry", "Microsoft Excel", "Typing"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Data processing and management services."
      },
      {
        title: "SEO Content Writer",
        company_name: "WordSmiths",
        description: "Write engaging, SEO-optimized blog posts and articles for various niches. Knowledge of SurferSEO or Clearscope is preferred.",
        salary_min: 800,
        salary_max: 1300,
        job_type: "Full-time",
        experience_level: "Intermediate",
        skills: ["SEO Writing", "Content Strategy", "Copywriting"],
        status: "approved",
        is_featured: true,
        employer_id: user.id,
        company_description: "Content marketing agency for tech blogs."
      },
      {
        title: "Amazon PPC Specialist",
        company_name: "AMZ Growth",
        description: "Manage and optimize Amazon advertising campaigns. Conduct keyword research and monitor ACOS/ROAS.",
        salary_min: 1000,
        salary_max: 1800,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Amazon PPC", "Keyword Research", "Analytics"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Amazon FBA consulting firm."
      },
      {
        title: "Video Editor (Reels/Shorts)",
        company_name: "Viral Media",
        description: "Edit high-energy short-form video content for Instagram Reels, TikTok, and YouTube Shorts. Experience with CapCut or Premiere Pro.",
        salary_min: 700,
        salary_max: 1200,
        job_type: "Contract",
        experience_level: "Intermediate",
        skills: ["Video Editing", "CapCut", "Short-form Content"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Social media production house."
      },
      {
        title: "Real Estate Virtual Assistant",
        company_name: "HomeLink Realty",
        description: "Assist real estate agents with cold calling, lead follow-up, and transaction coordination. Experience with Mojo Dialer or KVCore is a plus.",
        salary_min: 600,
        salary_max: 1000,
        job_type: "Full-time",
        experience_level: "Intermediate",
        skills: ["Cold Calling", "Real Estate", "CRM Management"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "US-based real estate brokerage."
      },
      {
        title: "Bookkeeper (QuickBooks)",
        company_name: "Finance Flow",
        description: "Manage daily bookkeeping tasks, bank reconciliations, and accounts payable/receivable using QuickBooks Online.",
        salary_min: 900,
        salary_max: 1500,
        job_type: "Part-time",
        experience_level: "Senior",
        skills: ["QuickBooks", "Bookkeeping", "Accounting"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Outsourced accounting for small businesses."
      },
      {
        title: "Email Marketing Specialist",
        company_name: "Inbox Magic",
        description: "Design and implement email automation flows using Klaviyo. Write compelling copy and segment audiences for maximum conversion.",
        salary_min: 1100,
        salary_max: 1700,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Klaviyo", "Email Marketing", "Copywriting"],
        status: "approved",
        is_featured: true,
        employer_id: user.id,
        company_description: "E-commerce email marketing agency."
      },
      {
        title: "App Developer (React Native)",
        company_name: "AppForge",
        description: "Develop and maintain cross-platform mobile applications using React Native. Strong JavaScript/TypeScript skills required.",
        salary_min: 1500,
        salary_max: 2500,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["React Native", "JavaScript", "Mobile Development"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Mobile app development studio."
      },
      {
        title: "Podcast Producer",
        company_name: "Audio Wave",
        description: "Handle audio editing, show notes creation, and guest coordination for multiple weekly podcasts. Proficient in Audacity or Adobe Audition.",
        salary_min: 700,
        salary_max: 1100,
        job_type: "Contract",
        experience_level: "Intermediate",
        skills: ["Audio Editing", "Podcast Management", "Show Notes"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Podcast production agency."
      },
      {
        title: "WordPress Developer",
        company_name: "WebWorks",
        description: "Build and customize WordPress websites using Elementor or Divi. Basic knowledge of PHP and CSS is required.",
        salary_min: 800,
        salary_max: 1400,
        job_type: "Full-time",
        experience_level: "Intermediate",
        skills: ["WordPress", "Elementor", "Web Development"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Web design and development agency."
      },
      {
        title: "Appointment Setter",
        company_name: "Growth Lab",
        description: "Call warm leads and set appointments for our sales team. High energy and persuasive communication skills needed.",
        salary_min: 500,
        salary_max: 900,
        job_type: "Full-time",
        experience_level: "Entry-level",
        skills: ["Appointment Setting", "Sales", "Communication"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Sales training and consulting company."
      },
      {
        title: "Pinterest Manager",
        company_name: "Visual Traffic",
        description: "Manage Pinterest accounts for lifestyle and home decor brands. Create pins, schedule with Tailwind, and optimize for SEO.",
        salary_min: 600,
        salary_max: 950,
        job_type: "Part-time",
        experience_level: "Intermediate",
        skills: ["Pinterest", "Tailwind App", "Visual Marketing"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Pinterest marketing agency."
      },
      {
        title: "Executive Assistant",
        company_name: "Elite Support",
        description: "Provide high-level administrative support to a CEO. Manage travel arrangements, handle confidential documents, and coordinate meetings.",
        salary_min: 1200,
        salary_max: 2000,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Executive Support", "Travel Planning", "Project Management"],
        status: "approved",
        is_featured: true,
        employer_id: user.id,
        company_description: "Premium virtual assistant service."
      },
      {
        title: "Shopify Developer",
        company_name: "Store Experts",
        description: "Customize Shopify themes using Liquid. Integrate third-party apps and optimize store performance.",
        salary_min: 1300,
        salary_max: 2200,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Shopify Liquid", "Web Development", "E-commerce"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Shopify development agency."
      },
      {
        title: "Content Moderator",
        company_name: "SafeSpace",
        description: "Review and moderate user-generated content on a large social platform. Ensure compliance with community guidelines and safety standards.",
        salary_min: 500,
        salary_max: 800,
        job_type: "Full-time",
        experience_level: "Entry-level",
        skills: ["Content Moderation", "Policy Compliance", "Attention to Detail"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Content safety and moderation services."
      },
      {
        title: "Ghostwriter (Non-Fiction)",
        company_name: "Author Assist",
        description: "Write high-quality non-fiction books and guides for busy entrepreneurs. Must be able to capture the client's voice and conduct thorough research.",
        salary_min: 1500,
        salary_max: 3000,
        job_type: "Contract",
        experience_level: "Senior",
        skills: ["Ghostwriting", "Research", "Creative Writing"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Premium ghostwriting service for business leaders."
      },
      {
        title: "Technical Writer",
        company_name: "DevDocs",
        description: "Create clear and concise documentation for software APIs and developer tools. Experience with Markdown and Git is required.",
        salary_min: 1200,
        salary_max: 2000,
        job_type: "Full-time",
        experience_level: "Intermediate",
        skills: ["Technical Writing", "Markdown", "API Documentation"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Documentation agency for tech startups."
      },
      {
        title: "Sales Development Representative",
        company_name: "Growth Engine",
        description: "Conduct outbound prospecting and qualify leads for our account executives. Must be comfortable with cold calling and email outreach.",
        salary_min: 800,
        salary_max: 1400,
        job_type: "Full-time",
        experience_level: "Intermediate",
        skills: ["Sales Prospecting", "Cold Calling", "CRM"],
        status: "approved",
        is_featured: false,
        employer_id: user.id,
        company_description: "Sales outsourcing for B2B companies."
      },
      {
        title: "UI/UX Designer",
        company_name: "Pixel Perfect",
        description: "Design intuitive and visually appealing user interfaces for web and mobile applications. Proficiency in Figma and Adobe XD is a must.",
        salary_min: 1400,
        salary_max: 2500,
        job_type: "Full-time",
        experience_level: "Senior",
        skills: ["Figma", "UI/UX Design", "Prototyping"],
        status: "approved",
        is_featured: true,
        employer_id: user.id,
        company_description: "Design-first product studio."
      }
    ];

    try {
      const { error } = await supabase.from('jobs').insert(sampleJobs);
      if (error) throw error;
      setSeedSuccess(true);
      fetchStats();
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error('Error seeding jobs:', err);
      alert('Failed to seed jobs. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const statCards = [
    { label: 'Worker Profiles', value: stats?.totalVAs?.count || 19, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions?.count || 0, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Jobs', value: stats?.pendingJobs?.count || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Jobs', value: stats?.totalJobs?.count || 0, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentActivity = [
    { user: 'Maria Santos', action: 'Created a new profile', date: 'Mar 6, 2026', status: 'success' },
    { user: 'TechStartup Inc.', action: 'Posted a new job: React Developer', date: 'Mar 6, 2026', status: 'pending' },
    { user: 'James Rivera', action: 'Upgraded to Premium plan', date: 'Mar 5, 2026', status: 'success' },
    { user: 'E-commerce Brand', action: 'Reported a worker profile', date: 'Mar 5, 2026', status: 'warning' },
    { user: 'Ana Reyes', action: 'Completed ID verification', date: 'Mar 4, 2026', status: 'success' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-zinc-900">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-4xl font-black text-zinc-900 mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-8 border-b border-zinc-100">
          <h3 className="text-xl font-bold text-zinc-900">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentActivity.map((activity, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-zinc-900">{activity.user}</td>
                  <td className="px-8 py-5 text-sm text-zinc-500">{activity.action}</td>
                  <td className="px-8 py-5 text-sm text-zinc-400">{activity.date}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      activity.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                      activity.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
