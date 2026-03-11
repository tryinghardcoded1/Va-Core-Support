import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  Search, 
  User, 
  Briefcase, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Plus,
  Users,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Send,
  Star,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './supabaseClient';
import AdminLayout from './pages/admin/AdminLayout';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type UserRole = 'admin' | 'employer' | 'va';
interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

// --- Components ---

// --- Components ---

const ApplyModal = ({ job, user, onClose }: { job: any, user: UserData | null, onClose: () => void }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'va') {
      alert('Only Virtual Assistants can apply for jobs.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          va_id: user.id,
          cover_letter: coverLetter
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
      >
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Application Sent!</h3>
            <p className="text-zinc-500">Your application has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">Apply for {job.title}</h3>
              <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Cover Letter</label>
              <textarea 
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role..."
                className="w-full h-48 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
              />
            </div>

            <button 
              disabled={submitting}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : (
                <>
                  Submit Application
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const JobDetailsPage = ({ user }: { user: UserData | null }) => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error('Job not found');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="h-8 w-64 bg-zinc-100 animate-pulse rounded mb-4" />
      <div className="h-4 w-full bg-zinc-100 animate-pulse rounded mb-2" />
      <div className="h-4 w-full bg-zinc-100 animate-pulse rounded mb-2" />
      <div className="h-4 w-3/4 bg-zinc-100 animate-pulse rounded" />
    </div>
  );

  if (!job) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">Job not found</h2>
      <button onClick={() => navigate('/jobs')} className="text-teal-600 font-bold hover:underline">Back to jobs</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              {job.logo_url ? (
                <img src={job.logo_url} alt={job.company_name} className="w-16 h-16 rounded-2xl object-cover border border-zinc-100" />
              ) : (
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-2xl">
                  {job.company_name?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-1">{job.title}</h1>
                <p className="text-zinc-500 font-medium">{job.company_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-zinc-100 mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Salary</div>
                <div className="text-sm font-bold text-emerald-600">${job.salary_min} - ${job.salary_max}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Job Type</div>
                <div className="text-sm font-bold text-zinc-900">{job.job_type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Experience</div>
                <div className="text-sm font-bold text-zinc-900">{job.experience_level}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Posted</div>
                <div className="text-sm font-bold text-zinc-900">{new Date(job.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="prose prose-zinc max-w-none">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Job Description</h3>
              <div className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                <Markdown>{job.description}</Markdown>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-bold border border-teal-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">About the Company</h3>
            <p className="text-zinc-600 leading-relaxed">{job.company_description || "No company description provided."}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-teal-600 p-8 rounded-3xl text-white shadow-xl shadow-teal-100 sticky top-24">
            <h3 className="text-2xl font-bold mb-2">Interested?</h3>
            <p className="text-teal-50 mb-8 text-sm leading-relaxed">Submit your application today and get a chance to work with {job.company_name}.</p>
            <button 
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-white text-teal-600 py-4 rounded-2xl font-bold hover:bg-teal-50 transition-all shadow-lg"
            >
              Apply Now
            </button>
            <p className="mt-4 text-[10px] text-center text-teal-200 uppercase font-bold tracking-widest">Usually responds in 24 hours</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Safety Tips
            </h4>
            <ul className="space-y-3 text-xs text-zinc-500 leading-relaxed">
              <li>• Never pay for job applications or training.</li>
              <li>• Be cautious of jobs that seem too good to be true.</li>
              <li>• Report any suspicious activity to our support team.</li>
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApplyModal && (
          <ApplyModal job={job} user={user} onClose={() => setShowApplyModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const RealReviewsPage = () => {
  const reviews = [
    {
      stars: 5,
      text: '"Before VA Core Support, I was drowning in customer service emails and order fulfillment issues. Finding my VA, Maria, changed everything. She handles the day-to-day operations flawlessly, allowing me to focus on product development. We\'ve doubled our revenue in 6 months."',
      name: "Sarah Jenkins",
      role: "E-commerce Founder"
    },
    {
      stars: 5,
      text: '"The quality of talent on this platform is unmatched. I hired a graphic designer and a social media manager within a week. They integrated into our team seamlessly and their work ethic is incredible. It\'s the best hiring decision I\'ve made."',
      name: "David Chen",
      role: "Digital Agency Owner"
    },
    {
      stars: 5,
      text: '"I was skeptical about hiring virtually, but the process was so easy. My VA manages my calendar, follows up with leads, and handles all the paperwork. I\'ve reclaimed at least 20 hours a week and my closing rate has improved because I\'m more focused."',
      name: "Amanda Brooks",
      role: "Real Estate Broker"
    },
    {
      stars: 5,
      text: '"We needed specialized developers but couldn\'t afford local rates. Through VA Core Support, we found two senior React developers who have been instrumental in launching our MVP ahead of schedule. The expertise is excellent despite the timezone difference."',
      name: "Marcus Johnson",
      role: "Tech Startup CEO"
    },
    {
      stars: 5,
      text: '"Video editing was taking up all my time. Now I just shoot the raw footage, drop it in a shared folder, and my VA edits, adds captions, and schedules the posts across all platforms. My channel growth has exploded since I started outsourcing."',
      name: "Elena Rodriguez",
      role: "Content Creator"
    },
    {
      stars: 5,
      text: '"Our administrative overhead was eating into our margins. We hired a team of three VAs for data entry, research, and basic bookkeeping. The cost savings are substantial, and the accuracy of their work is top-notch. Highly recommend this platform."',
      name: "Tom Baker",
      role: "Consulting Firm Partner"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-6">Outsourcing changes lives—and we have the proof.</h1>
        <div className="w-24 h-1 bg-teal-500 mx-auto mb-10"></div>
        <p className="text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed mb-20">
          We've helped hundreds of founders transition from overwhelmed to empowered. 
          By leveraging our outsourcing model, these entrepreneurs have unlocked a new 
          level of personal and professional liberty. Here is a look at how that 
          transformation actually looks in practice.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm text-left flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {[...Array(review.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-600 italic leading-relaxed mb-8 flex-grow">
                {review.text}
              </p>
              <div>
                <h4 className="font-bold text-zinc-900">{review.name}</h4>
                <p className="text-sm text-zinc-400">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ user, onLogout }: { user: UserData | null; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://static.wixstatic.com/media/225ce0_770c0e789f0348bda3ee004f32a8fb0c~mv2.png/v1/crop/x_244,y_190,w_518,h_479/fill/w_108,h_100,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design.png" 
                alt="Va Core Support Logo" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold text-zinc-900 tracking-tight">Va Core Support</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Find Jobs</Link>
            <Link to="/real-reviews" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Real Reviews</Link>
            <Link to="/pricing" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Pricing</Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <span className="text-xs text-zinc-400 font-medium">{user.email}</span>
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'employer' ? '/employer' : '/va'}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout}
                  className="text-zinc-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Log in</Link>
                <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all shadow-sm">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-zinc-200 px-4 pt-2 pb-6 space-y-1"
          >
            <Link to="/jobs" className="block px-3 py-2 text-base font-medium text-zinc-600">Find Jobs</Link>
            <Link to="/real-reviews" className="block px-3 py-2 text-base font-medium text-zinc-600">Real Reviews</Link>
            <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-zinc-600">Pricing</Link>
            {!user ? (
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" className="text-center py-2 text-zinc-600 font-medium">Log in</Link>
                <Link to="/register" className="text-center py-2 bg-indigo-600 text-white rounded-lg font-medium">Sign up</Link>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'employer' ? '/employer' : '/va'}
                  className="text-center py-2 bg-zinc-100 rounded-lg font-medium"
                >
                  Dashboard
                </Link>
                <button onClick={onLogout} className="text-center py-2 text-red-600 font-medium">Log out</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ user }: { user: UserData | null }) => {
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setFeaturedJobs(data.filter((j: any) => j.is_featured).slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const commonSearches = [
    'Virtual Assistant', 'Amazon Expert', 'Facebook Ads Manager', 'Copywriter',
    'Wordpress Developer', 'Sales Representative', 'Lead Generation', 'QuickBooks',
    'SEO', 'Marketing Specialist', 'Email Marketer', 'PPC',
    'Graphic Designer', 'Shopify Expert', 'eBay Virtual Assistant', 'Ecommerce',
    'Social Media Marketer', 'Video Editor', 'Customer Service', 'Researcher',
    'PHP Developer', 'Data Entry', 'Google Ads Manager', 'Accountant',
    'Real Estate Virtual Assistant', 'Web Developer', 'Magento Developer', 'iOS Developer',
    'Content Writer', 'Project Manager', 'Web Designer', 'Photoshop',
    'GoHighLevel'
  ];

  const employerQuotes = [
    { text: "helped me to...", highlight: "free up my life." },
    { text: "...", highlight: "changed my life trajectory." },
    { text: "...", highlight: "caused me to increase sales." },
    { text: "I'm now", highlight: "doing three times as much" },
    { text: "at a", highlight: "tenth of the time." },
    { text: "I am", highlight: "accomplishing WAY more." },
    { text: "", highlight: "My life is much more organized." },
    { text: "I've already scaled", highlight: "content production by at least a double." },
    { text: "", highlight: "grow my business" },
    { text: "from 500k to nearly 1.5M today", highlight: "" },
    { text: "...really", highlight: "focus on strategy and business growth." },
    { text: "found the perfect match in", highlight: "under 48 hours." },
    { text: "the quality of talent is", highlight: "absolutely unmatched." },
    { text: "my VA handles the chaos so I can", highlight: "focus on scaling." },
    { text: "", highlight: "saved over 20 hours" },
    { text: "a week on admin tasks.", highlight: "" },
    { text: "best investment I've made for my", highlight: "peace of mind." }
  ];

  const verticalLinks = [
    'Why?', 'Cost', 'Time', 'Trust', 'Legal', 'Taxes', 'Talent', 'Security', 'Payments', 'Timezones', 'Get Started'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome Message for Logged In Users */}
      {user && (
        <div className="bg-teal-600 text-white py-3 text-center font-bold">
          Welcome, {user.email}! You are successfully logged in.
        </div>
      )}
      
      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight mb-8"
          >
            The Job Board for Virtual <br /> Workers in the Philippines.
          </motion.h1>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {['Verified Talent', 'Secure Payments', 'Satisfaction Guarantee'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-teal-600 font-medium">
                <Check className="w-5 h-5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Looking for <span className="text-teal-600">Talent?</span></h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search Resumes" 
                  className="w-full pl-12 pr-24 py-4 bg-white border border-zinc-200 rounded-full outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all">
                  SEARCH
                </button>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Looking for <span className="text-teal-600">Work?</span></h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search Jobs" 
                  className="w-full pl-12 pr-24 py-4 bg-white border border-zinc-200 rounded-full outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all">
                  SEARCH
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Talent Searches */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Common Talent Searches</h2>
          <div className="w-16 h-1 bg-teal-500 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-left max-w-5xl mx-auto">
            {commonSearches.map((search) => (
              <Link key={search} to={`/jobs?q=${search}`} className="text-sm text-blue-600 hover:underline">
                {search}
              </Link>
            ))}
          </div>
          
          <div className="mt-12">
            <button className="px-8 py-2 border border-zinc-200 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all">
              SEE MORE SKILLS
            </button>
          </div>
        </div>
      </section>

      {/* What our Employers say */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">What our Employers say</h2>
          <div className="w-16 h-1 bg-teal-500 mx-auto mb-12"></div>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 max-w-4xl mx-auto leading-loose">
            {employerQuotes.map((quote, i) => (
              <div key={i} className="flex items-center gap-1 text-zinc-900 font-medium">
                {quote.text && <span>{quote.text}</span>}
                {quote.highlight && (
                  <span className="bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 text-zinc-900">
                    {quote.highlight}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <button className="px-8 py-2 border border-zinc-200 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all">
              SHOW MORE REAL RESULTS
            </button>
          </div>
        </div>
      </section>

      {/* Vertical Links */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            {verticalLinks.map((link) => (
              <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-blue-600 hover:underline">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section (Keep it but maybe move it or style it) */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Featured Opportunities</h2>
              <p className="text-zinc-600">Hand-picked premium roles from top employers.</p>
            </div>
            <Link to="/jobs" className="text-teal-600 font-bold hover:underline flex items-center gap-1">
              View all jobs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-100 animate-pulse rounded-2xl border border-zinc-200" />)
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map(job => (
                <Link 
                  key={job.id} 
                  to={`/jobs/${job.id}`}
                  className="group bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-xl hover:border-teal-100 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0">
                    <div className="bg-amber-400 text-white text-[10px] font-black uppercase tracking-tighter px-6 py-1 rotate-45 translate-x-4 translate-y-2 shadow-sm">
                      Featured
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors mb-2">{job.title}</h3>
                    <div className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> {job.company_name || 'Premium Employer'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-50">
                    <div className="text-emerald-600 font-bold text-sm">
                      ${job.salary_min} - ${job.salary_max}
                    </div>
                    <div className="text-zinc-400 text-xs font-medium">
                      {job.job_type}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-zinc-200">
                <p className="text-zinc-500">No featured jobs at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: UserData) => void }) => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.signupSuccess ? 'Your account has been created. Please check your email and verify your address before logging in.' : '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.signupSuccess) {
      setSuccessMessage('Your account has been created. Please check your email and verify your address before logging in.');
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    console.log('Mock Login attempt', { email });
    
    // MOCK LOGIN BYPASS
    setTimeout(() => {
      const mockUser: UserData = {
        id: 'mock-user-id',
        name: email.split('@')[0] || 'User',
        email: email,
        role: email.includes('admin') ? 'admin' : email.includes('emp') ? 'employer' : 'va',
        status: 'approved'
      };
      
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      onLogin(mockUser);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Welcome Back</h1>
          <p className="text-zinc-500">Log in to your Va Core Support account</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {successMessage && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-4">{successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email or Username</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="va@demo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};

const RegisterPage = ({ onLogin }: { onLogin: (user: UserData) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('va');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creationStep, setCreationStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    "Securing your connection...",
    "Creating your profile...",
    "Setting up your dashboard...",
    "Finalizing account details..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setCreationStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Mock Register attempt', { email, role });
    
    // MOCK REGISTER BYPASS
    setTimeout(() => {
      const mockUser: UserData = {
        id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: role,
        status: 'approved'
      };
      
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      onLogin(mockUser);
      setLoading(false);
      
      // Redirect to appropriate dashboard
      const dashboardPath = role === 'admin' ? '/admin' : role === 'employer' ? '/employer' : '/va';
      navigate(dashboardPath);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm w-full"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Creating Account</h2>
          <p className="text-zinc-500 animate-pulse">{steps[creationStep]}</p>
          
          <div className="mt-8 w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${((creationStep + 1) / steps.length) * 100}%` }}
              className="h-full bg-indigo-600"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Create Account</h1>
          <p className="text-zinc-500">Join the Va Core Support community today</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              type="button"
              onClick={() => setRole('va')}
              className={cn(
                "py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                role === 'va' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-zinc-100 text-zinc-500 hover:border-zinc-200"
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">I'm a VA</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('employer')}
              className={cn(
                "py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                role === 'employer' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-zinc-100 text-zinc-500 hover:border-zinc-200"
              )}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs">I'm Hiring</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

// --- Dashboards ---

// --- Admin Dashboard ---
// Moved to src/pages/admin/AdminLayout.tsx

const EmployerDashboard = ({ user }: { user: UserData }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch applications for jobs owned by this employer
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(title, employer_id),
          profiles:va_id(full_name)
        `)
        .eq('jobs.employer_id', user.id);

      if (appsError) throw appsError;

      // Fetch subscription from employer_profiles
      const { data: employerProfile, error: subError } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (subError && subError.code !== 'PGRST116') throw subError;

      setApplications((apps || []).map(a => ({
        ...a,
        job_title: a.jobs?.title,
        va_name: a.profiles?.full_name || 'VA User'
      })));
      setSubscription(employerProfile);
    } catch (err) {
      console.error('Error fetching employer data:', err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          employer_id: user.id,
          title,
          company_name: user.name, // Using user's name as company name for now
          description,
          salary_min: Number(salaryMin),
          salary_max: Number(salaryMax),
          job_type: 'Full-time',
          status: 'pending'
        });

      if (error) throw error;

      setShowPostModal(false);
      alert('Job posted! Awaiting admin approval.');
      fetchData();
    } catch (err) {
      console.error('Error posting job:', err);
      alert('Failed to post job');
    }
  };

  const handleHire = async (appId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'hired' })
        .eq('id', appId);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error hiring:', err);
    }
  };

  const handleUnhire = async (appId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'pending' })
        .eq('id', appId);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error unhiring:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Employer Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/talents" className="bg-white text-zinc-900 border border-zinc-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all">
            <Search className="w-5 h-5" />
            Browse VAs
          </Link>
          <button 
            onClick={() => setShowPostModal(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Recent Applicants</h2>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-20 bg-zinc-50 rounded-xl" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                No applicants yet. Post a job to start receiving applications.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {applications.map((app) => (
                  <div key={app.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-zinc-900">{app.va_name}</div>
                      <div className="text-xs text-zinc-500">Applied for: {app.job_title}</div>
                      <div className="mt-1">
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                          app.status === 'hired' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {app.status === 'hired' ? (
                        <button onClick={() => handleUnhire(app.id)} className="text-xs font-bold text-red-600 hover:underline">Unhire</button>
                      ) : (
                        <button onClick={() => handleHire(app.id)} className="text-xs font-bold text-emerald-600 hover:underline">Hire Now</button>
                      )}
                      <Link to={`/messages/${app.va_id}`} className="text-xs font-bold text-indigo-600 hover:underline">Message</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-bold mb-2">Current Plan: {subscription?.plan_name || 'Free'}</h3>
            <p className="text-indigo-100 text-sm mb-6">
              {!subscription || subscription.plan_name === 'Free' 
                ? 'Upgrade to post more jobs and contact more VAs.' 
                : `Your plan expires on ${subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}`}
            </p>
            <Link to="/pricing" className="block w-full text-center bg-white text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all">
              {subscription?.plan_name === 'Free' ? 'Upgrade Plan' : 'Manage Subscription'}
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button className="w-full text-left text-sm text-zinc-600 hover:text-indigo-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Company Profile
              </button>
              <button className="w-full text-left text-sm text-zinc-600 hover:text-indigo-600 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Billing Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Post a New Job</h2>
                <button onClick={() => setShowPostModal(false)} className="text-zinc-400 hover:text-zinc-600"><X /></button>
              </div>
              <form onSubmit={handlePostJob} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Job Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Executive Virtual Assistant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                    placeholder="Describe the role and responsibilities..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Min Salary ($/mo)</label>
                    <input 
                      type="number" 
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Max Salary ($/mo)</label>
                    <input 
                      type="number" 
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="1500"
                    />
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  Publish Job Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VADashboard = ({ user }: { user: UserData }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile' | 'messages'>('jobs');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsRes, profileRes] = await Promise.all([
        supabase
          .from('jobs')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('va_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
      ]);

      if (jobsRes.error) throw jobsRes.error;
      if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;

      setJobs(jobsRes.data || []);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Error fetching VA data:', err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Welcome, {user.name}</h1>
        <div className="flex bg-white p-1 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'jobs' ? "bg-teal-600 text-white" : "text-zinc-500 hover:text-zinc-900")}
          >
            Find Jobs
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'profile' ? "bg-teal-600 text-white" : "text-zinc-500 hover:text-zinc-900")}
          >
            My Profile
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'messages' ? "bg-teal-600 text-white" : "text-zinc-500 hover:text-zinc-900")}
          >
            Messages
          </button>
        </div>
      </div>
      
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Recommended Jobs</h2>
              <Link to="/jobs" className="text-sm font-bold text-indigo-600 hover:underline">View all</Link>
            </div>
            
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 text-zinc-500">
                  No jobs available right now. Check back later!
                </div>
              ) : (
                jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <p className="text-sm text-zinc-500 font-medium">{job.company_name}</p>
                      </div>
                      {job.is_featured ? (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Featured</span>
                      ) : null}
                    </div>
                    <p className="text-zinc-600 text-sm line-clamp-2 mb-4">{job.description}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${job.salary_min} - ${job.salary_max}/mo</div>
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.job_type}</div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link to={`/jobs/${job.id}`} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all text-center">View & Apply</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-xl text-zinc-400">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{user.name}</h3>
                  <p className="text-xs text-zinc-500">Profile Strength: {profile?.bio ? '85%' : '45%'}</p>
                </div>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full mb-6">
                <div className={cn("bg-indigo-600 h-2 rounded-full", profile?.bio ? "w-[85%]" : "w-[45%]")} />
              </div>
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all"
              >
                {profile?.bio ? 'Update Profile' : 'Complete Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <VAProfileEdit user={user} initialProfile={profile} onSave={fetchData} />
      )}

      {activeTab === 'messages' && (
        <MessagesPage user={user} />
      )}
    </div>
  );
};

const VAProfileEdit = ({ user, initialProfile, onSave }: { user: UserData, initialProfile: any, onSave: () => void }) => {
  const [headline, setHeadline] = useState(initialProfile?.headline || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(initialProfile?.hourly_rate || '');
  const [monthlySalary, setMonthlySalary] = useState(initialProfile?.monthly_salary || '');
  const [availability, setAvailability] = useState(initialProfile?.availability || '');
  const [skills, setSkills] = useState<any[]>(initialProfile?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [newExp, setNewExp] = useState('1 - 2 years');
  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill) return;
    setSkills([...skills, { skill_name: newSkill, years_experience: newExp }]);
    setNewSkill('');
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('va_profiles')
        .upsert({
          id: user.id,
          title: headline,
          bio,
          hourly_rate: Number(hourlyRate),
          availability,
          skills: skills.map(s => `${s.skill_name} (${s.years_experience})`) // Simplified for now
        });

      if (error) throw error;

      onSave();
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8">Edit Your Professional Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-zinc-700 mb-2">Professional Headline</label>
            <input 
              type="text" 
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Expert Virtual Assistant | Social Media Manager"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">Hourly Rate (USD)</label>
            <input 
              type="number" 
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="5.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">Monthly Salary (USD)</label>
            <input 
              type="number" 
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="800"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-zinc-700 mb-2">Availability</label>
            <select 
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select availability</option>
              <option value="full-time work (8 hours/day)">Full-time (8 hrs/day)</option>
              <option value="part-time work (4 hours/day)">Part-time (4 hrs/day)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-zinc-700 mb-2">Bio / Description</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-48 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Tell employers about your experience and what you can offer..."
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-teal-100">
                {skill.skill_name} ({skill.years_experience})
                <button type="button" onClick={() => handleRemoveSkill(i)} className="text-teal-400 hover:text-teal-600"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-sm"
              placeholder="Add a skill (e.g. Data Entry)"
            />
            <select 
              value={newExp}
              onChange={(e) => setNewExp(e.target.value)}
              className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-sm"
            >
              <option>Less than 6 months</option>
              <option>1 - 2 years</option>
              <option>2 - 5 years</option>
              <option>5+ years</option>
            </select>
            <button 
              type="button" 
              onClick={handleAddSkill}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-teal-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        </div>

        <button 
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          {saving ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

const MessagesPage = ({ user }: { user: UserData }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(chatId || null);

  useEffect(() => {
    if (chatId) setActiveChat(chatId);
  }, [chatId]);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(full_name),
          receiver:receiver_id(full_name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = (data || []).map(m => ({
        ...m,
        sender_name: m.sender?.full_name || 'User',
        receiver_name: m.receiver?.full_name || 'User',
        message_body: m.content
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [user.id]);

  useEffect(() => {
    fetchMessages();
    // Use Supabase Realtime for messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  const chats = Array.from(new Set(messages.map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id)));
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !newMessage) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activeChat,
          content: newMessage
        });

      if (error) throw error;
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const activeMessages = messages.filter(m => 
    (m.sender_id === user.id && m.receiver_id === activeChat) || 
    (m.sender_id === activeChat && m.receiver_id === user.id)
  );

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden h-[600px] flex">
      <div className="w-1/3 border-r border-zinc-100 flex flex-col">
        <div className="p-6 border-b border-zinc-100 font-bold text-zinc-900">Conversations</div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-sm italic">No conversations yet.</div>
          ) : (
            chats.map(chatId => {
              const lastMsg = messages.filter(m => m.sender_id === chatId || m.receiver_id === chatId).pop();
              const otherName = lastMsg?.sender_id === user.id ? lastMsg?.receiver_name : lastMsg?.sender_name;
              return (
                <button 
                  key={chatId}
                  onClick={() => setActiveChat(chatId)}
                  className={cn(
                    "w-full p-4 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-50",
                    activeChat === chatId && "bg-indigo-50 border-l-4 border-l-indigo-600"
                  )}
                >
                  <div className="font-bold text-zinc-900">{otherName}</div>
                  <div className="text-xs text-zinc-500 truncate">{lastMsg?.message_body}</div>
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-6 border-b border-zinc-100 font-bold text-zinc-900 flex items-center justify-between">
              Chatting with {messages.find(m => m.sender_id === activeChat || m.receiver_id === activeChat)?.sender_id === user.id ? messages.find(m => m.sender_id === activeChat || m.receiver_id === activeChat)?.receiver_name : messages.find(m => m.sender_id === activeChat || m.receiver_id === activeChat)?.sender_name}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map(m => (
                <div key={m.id} className={cn("flex", m.sender_id === user.id ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[70%] p-3 rounded-2xl text-sm",
                    m.sender_id === user.id ? "bg-indigo-600 text-white rounded-tr-none" : "bg-zinc-100 text-zinc-900 rounded-tl-none"
                  )}>
                    {m.message_body}
                    <div className={cn("text-[8px] mt-1 opacity-70", m.sender_id === user.id ? "text-right" : "text-left")}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PricingPage = ({ user }: { user?: UserData }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (planName: string) => {
    if (!user) {
      alert('Please login to upgrade');
      return;
    }
    if (planName === 'FREE') return;
    
    setUpgrading(true);
    try {
      const { error } = await supabase
        .from('employer_profiles')
        .upsert({
          id: user.id,
          subscription_plan: planName.toLowerCase(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        });

      if (error) throw error;

      alert('Subscription upgraded successfully!');
      window.location.href = '/employer';
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      alert('Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      name: 'FREE',
      price: 'FREE',
      subtitle: 'WHY NO FREE TRIAL?',
      color: 'border-emerald-500',
      headerBg: 'bg-emerald-500',
      features: [
        'Hire & Communicate with Workers',
        'Up to 3 Job Posts',
        'Max 15 applications per Job',
        '2 days Job Post approval',
        'View Job Applications',
        'Use Timeproof',
        'Bookmark Workers',
        'Easypay'
      ]
    },
    {
      name: 'PRO',
      price: '$29',
      subtitle: 'Cancel anytime.',
      color: 'border-blue-500',
      headerBg: 'bg-blue-500',
      savings: '64% Savings!',
      features: [
        'Hire & Communicate with Workers',
        'Up to 3 Job Posts',
        'Max 200 applications per Job',
        'Instant Job Post approval',
        'View Job Applications',
        'Use Timeproof',
        'Bookmark Workers',
        'Easypay',
        'Contact 75 workers / month',
        'Read Worker Reviews'
      ],
      footer: 'Cancel Anytime Easily'
    },
    {
      name: 'PREMIUM',
      price: '$39',
      subtitle: 'Cancel anytime.',
      color: 'border-red-500',
      headerBg: 'bg-red-500',
      badge: 'MOST POPULAR!',
      savings: '71% Savings!',
      aiMatching: true,
      features: [
        'Hire & Communicate with Workers',
        'Up to 10 Job Posts',
        'Max 200 applications per Job',
        'Instant Job Post approval',
        'View Job Applications',
        'Use Timeproof',
        'Bookmark Workers',
        'Easypay',
        'Contact 500 workers / month',
        'Read Worker Reviews',
        'Unlimited Background Data Checks',
        'Worker Mentoring Service'
      ],
      footer: 'Cancel Anytime Easily'
    }
  ];

  return (
    <div className="bg-zinc-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">Hire direct. No salary markups or ongoing fees.</h1>
          <p className="text-xl text-zinc-600">Cancel when done recruiting.</p>
          <p className="text-lg text-zinc-500 font-medium">Hire great talent or we'll give your money back. It's better than a "free trial."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={cn(
              "bg-white rounded-3xl border-t-8 shadow-xl overflow-hidden relative flex flex-col h-full",
              plan.color
            )}>
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              
              <div className="p-8 text-center border-b border-zinc-100">
                <div className={cn("inline-block px-4 py-1 rounded-lg text-white text-sm font-bold mb-4 uppercase tracking-wider", plan.headerBg)}>
                  {plan.name}
                </div>
                {plan.subtitle && (
                  <div className="mb-4">
                    <button className="text-blue-600 text-xs font-bold underline uppercase tracking-wider hover:text-blue-700">
                      {plan.subtitle}
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-6xl font-black text-blue-600 tracking-tighter">{plan.price}</span>
                  {plan.price !== 'FREE' && <span className="text-zinc-400 font-bold text-sm self-end mb-2">USD</span>}
                </div>
                {plan.price !== 'FREE' && (
                  <div className="bg-blue-600 text-white text-[10px] font-bold py-1 px-3 rounded inline-block mb-6">
                    Cancel anytime.
                  </div>
                )}

                {plan.savings && (
                  <div className="flex p-1 bg-zinc-100 rounded-xl mb-6">
                    <button 
                      onClick={() => setBillingCycle('monthly')}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                        billingCycle === 'monthly' ? "bg-blue-600 text-white shadow-md" : "text-zinc-500"
                      )}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setBillingCycle('annually')}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all relative",
                        billingCycle === 'annually' ? "bg-blue-600 text-white shadow-md" : "text-zinc-500"
                      )}
                    >
                      Annually
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        ({plan.savings})
                      </span>
                    </button>
                  </div>
                )}

                {plan.aiMatching && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left relative overflow-hidden">
                    <div className="text-blue-800 font-bold text-xs">AI Matching</div>
                    <div className="text-blue-600 text-[10px] font-medium">(Tell me who to hire!)</div>
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">NEW!</div>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-blue-600 rounded p-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold text-zinc-700 leading-tight">
                      {feature.includes('workers / month') ? (
                        <>
                          {feature} <span className="text-blue-400 font-black">?</span>
                        </>
                      ) : feature}
                    </span>
                  </div>
                ))}

                {plan.aiMatching && (
                  <div className="flex items-start gap-3 pt-4 border-t border-zinc-50">
                    <div className="mt-0.5 bg-blue-600 rounded p-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-700">AI Matching</span>
                        <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">NEW!</span>
                        <span className="text-blue-400 font-black text-xs">?</span>
                      </div>
                      <div className="text-[10px] text-blue-600 font-medium">(Tell me who to hire!)</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-8 pb-8">
                <button 
                  disabled={upgrading || plan.price === 'FREE'}
                  onClick={() => handleUpgrade(plan.name)}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg",
                    plan.price === 'FREE' ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-blue-200"
                  )}
                >
                  {upgrading ? 'Processing...' : plan.price === 'FREE' ? 'Current Plan' : 'GET STARTED'}
                </button>
              </div>

              {plan.footer && (
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
                  <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:underline">
                    <ShieldCheck className="w-3 h-3" />
                    {plan.footer}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TalentSearchPage = () => {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [salaryRange, setSalaryRange] = useState([2, 40]);
  const [idProofMin, setIdProofMin] = useState(40);

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('va_profiles')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match the expected format
      const formattedTalents = (data || []).map(t => ({
        ...t,
        name: t.profiles?.full_name || 'VA User'
      }));
      
      setTalents(formattedTalents);
    } catch (err) {
      console.error('Error fetching talents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTalents = talents.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.headline.toLowerCase().includes(search.toLowerCase()) ||
                         t.bio.toLowerCase().includes(search.toLowerCase());
    const matchesSalary = t.hourly_rate >= salaryRange[0] && t.hourly_rate <= salaryRange[1];
    const matchesIdProof = t.id_proof_score >= idProofMin;
    return matchesSearch && matchesSalary && matchesIdProof;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Better Search Results?</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Active Skill Filters</label>
                <button className="w-full py-2 px-4 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-sm font-bold hover:border-teal-500 hover:text-teal-600 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add skill filters
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Employment Type</label>
                <select className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Any</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Availability (Hours Per Day)</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={2} className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none" />
                  <span className="text-zinc-400">-</span>
                  <input type="number" defaultValue={12} className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Hourly Salary (USD)</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input 
                      type="number" 
                      value={salaryRange[0]} 
                      onChange={(e) => setSalaryRange([parseInt(e.target.value) || 0, salaryRange[1]])}
                      className="w-full p-3 pl-6 bg-white border border-zinc-200 rounded-xl text-sm outline-none" 
                    />
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input 
                      type="number" 
                      value={salaryRange[1]} 
                      onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value) || 0])}
                      className="w-full p-3 pl-6 bg-white border border-zinc-200 rounded-xl text-sm outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">ID Proof Score</label>
                <select 
                  value={idProofMin}
                  onChange={(e) => setIdProofMin(parseInt(e.target.value))}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={0}>Any</option>
                  <option value={40}>40+</option>
                  <option value={60}>60+</option>
                  <option value={80}>80+</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                {['Last Active', 'IQ Score', 'English Score'].map(filter => (
                  <div key={filter}>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{filter}</label>
                    <select className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none">
                      <option>Any</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
            <p className="text-sm text-teal-800 font-medium italic mb-4">
              Va Core Support
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-200 rounded-full" />
              <div>
                <div className="text-xs font-bold text-teal-900">Sam Sapp</div>
                <button className="text-[10px] font-bold text-teal-600 uppercase tracking-wider hover:underline">See more real results</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search Profile Descriptions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search Name"
                className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-zinc-500 font-medium">
              Found <span className="font-bold text-zinc-900">{filteredTalents.length}</span> jobseekers.
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm font-medium text-zinc-600">Include Hired Profiles</span>
            </label>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 animate-pulse h-64" />
              ))
            ) : filteredTalents.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center">
                <Search className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No jobseekers found</h3>
                <p className="text-zinc-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredTalents.map((talent) => (
                <motion.div 
                  key={talent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-2xl border border-teal-100">
                        {talent.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">{talent.name}</h3>
                          <p className="text-zinc-500 font-medium">{talent.headline}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider hover:text-teal-600 transition-colors">PIN</button>
                          <Link to={`/messages/${talent.user_id}`} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">message</Link>
                          <button className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-xs font-bold hover:bg-teal-100 transition-colors">view profile</button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {talent.id_proof_score} ID PROOF
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          LOOKING FOR {talent.availability}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          at ${talent.hourly_rate}/hour (${talent.monthly_salary}/month)
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 py-4 border-y border-zinc-50">
                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Education</div>
                          <div className="text-xs font-bold text-zinc-700">{talent.education}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Active</div>
                          <div className="text-xs font-bold text-zinc-700">{talent.last_active}</div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Profile Description</div>
                        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">{talent.bio}</p>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Top Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {talent.skills?.map((skill: any, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-zinc-50 text-zinc-600 rounded-lg text-xs font-bold border border-zinc-100">
                              {skill.skill_name}: <span className="text-zinc-400">{skill.years_experience}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
              <button key={p} className={cn("w-10 h-10 rounded-xl text-sm font-bold transition-all", p === 1 ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "bg-white text-zinc-500 border border-zinc-200 hover:border-teal-500 hover:text-teal-600")}>
                {p}
              </button>
            ))}
            <button className="w-10 h-10 rounded-xl bg-white text-zinc-500 border border-zinc-200 hover:border-teal-500 hover:text-teal-600 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobsPage = ({ user }: { user: UserData | null }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const allSkills = Array.from(new Set(jobs.flatMap(j => (j.skills || []) as string[]))).sort() as string[];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.description.toLowerCase().includes(search.toLowerCase()) ||
                          (job.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter.length === 0 || typeFilter.includes(job.job_type);
    const matchesSkills = skillFilter.length === 0 || skillFilter.every(s => (job.skills || []).includes(s));
    return matchesSearch && matchesType && matchesSkills;
  }).sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  const toggleType = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSkill = (skill: string) => {
    setSkillFilter(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill);
      if (prev.length >= 3) return prev;
      return [...prev, skill];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-72 space-y-8">
          <div>
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
              Filter by skills
            </h3>
            <div className="mb-2 text-[10px] font-bold text-teal-600 uppercase">Select up to 3 skills</div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or skills..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                    skillFilter.includes(skill) 
                      ? "bg-teal-600 border-teal-600 text-white" 
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-teal-300"
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-zinc-900 mb-4 uppercase text-xs tracking-widest">Employment Type</h3>
            <div className="space-y-3">
              {['Gig', 'Part-Time', 'Full-Time'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div 
                    onClick={() => toggleType(type)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      typeFilter.includes(type) ? "bg-teal-600 border-teal-600" : "border-zinc-200 group-hover:border-zinc-300"
                    )}
                  >
                    {typeFilter.includes(type) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-900">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
            <h4 className="font-bold text-teal-900 text-sm mb-2">Need help?</h4>
            <p className="text-xs text-teal-700 leading-relaxed mb-4">Our support team is here to help you find the perfect job.</p>
            <button className="text-xs font-bold text-teal-600 hover:underline">Contact Support</button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">
              Displaying <span className="text-teal-600">{filteredJobs.length}</span> out of {jobs.length} jobs
            </h2>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No jobs found</h3>
                <p className="text-zinc-500 mb-6">Try adjusting your filters or search terms.</p>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                  >
                    Go to Admin Dashboard to Seed Data
                  </button>
                )}
              </div>
            ) : (
              filteredJobs.map((job) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={job.id} 
                  className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all group relative overflow-hidden"
                >
                  {job.is_featured ? (
                    <div className="absolute top-0 right-0">
                      <div className="bg-amber-400 text-white text-[10px] font-black uppercase tracking-tighter px-6 py-1 rotate-45 translate-x-4 translate-y-2 shadow-sm">
                        Featured
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">{job.title}</h3>
                        <span className="text-xs font-medium text-zinc-400">• Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary_min === job.salary_max ? `$${job.salary_min}` : `$${job.salary_min} - $${job.salary_max}`}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                          <Briefcase className="w-4 h-4" />
                          {job.company_name}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                          <Clock className="w-4 h-4" />
                          {job.job_type}
                        </div>
                      </div>
                      <p className="text-zinc-600 leading-relaxed mb-6 line-clamp-3">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {(job.skills || []).map((skill: string) => (
                          <span key={skill} className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-100 px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {['Remote', 'Verified'].map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-100 px-2 py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[140px]">
                      <button 
                        onClick={() => setApplyingJob(job)}
                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
                      >
                        Apply Now
                      </button>
                      <button 
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full bg-white text-zinc-900 border border-zinc-200 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {applyingJob && (
          <ApplyModal job={applyingJob} user={user} onClose={() => setApplyingJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-zinc-600 mb-4">The application encountered an unexpected error.</p>
            <pre className="bg-zinc-50 p-4 rounded-lg text-xs text-red-500 overflow-auto max-h-40">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App initializing...');
    
    // Check for mock session first
    const savedUser = localStorage.getItem('mock_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('mock_user');
      }
    }

    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('App initialization timed out, forcing load.');
        setLoading(false);
      }
    }, 5000);

    // Check active session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        console.log('Session check complete', { hasSession: !!session });
        if (session?.user) {
          try {
            // Fetch profile to get role and status
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const userData: UserData = {
              id: session.user.id,
              name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'va',
              status: profile?.status || 'approved'
            };
            setUser(userData);
          } catch (err) {
            console.error('Error fetching profile:', err);
          }
        }
      })
      .catch(err => {
        console.error('Supabase session error:', err);
      })
      .finally(() => {
        setLoading(false);
        clearTimeout(timeout);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userData: UserData = {
          id: session.user.id,
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'va',
          status: profile?.status || 'approved'
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 font-medium">Loading Va Core Support...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main>
            <Routes>
              <Route path="/" element={<LandingPage user={user} />} />
              <Route path="/real-reviews" element={<RealReviewsPage />} />
              <Route path="/jobs" element={<JobsPage user={user} />} />
              <Route path="/jobs/:id" element={<JobDetailsPage user={user} />} />
              <Route path="/talents" element={<TalentSearchPage />} />
              <Route path="/pricing" element={<PricingPage user={user || undefined} />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
              
              {/* Protected Routes */}
              <Route path="/admin/*" element={user?.role === 'admin' ? <AdminLayout user={user} /> : <Navigate to="/login" />} />
              <Route path="/employer" element={user?.role === 'employer' ? <EmployerDashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/va" element={user?.role === 'va' ? <VADashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/messages/:chatId" element={user ? <div className="max-w-7xl mx-auto px-4 py-8"><MessagesPage user={user} /></div> : <Navigate to="/login" />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-zinc-200 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                  <h4 className="font-bold text-zinc-900 mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/jobs" className="hover:text-teal-600">Find Jobs</Link></li>
                    <li><Link to="/talents" className="hover:text-teal-600">Find Talent</Link></li>
                    <li><Link to="/real-reviews" className="hover:text-teal-600">Real Reviews</Link></li>
                    <li><Link to="/pricing" className="hover:text-teal-600">Pricing</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/help" className="hover:text-indigo-600">Help Center</Link></li>
                    <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
                    <li><Link to="/safety" className="hover:text-indigo-600">Safety & Trust</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
                    <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
                    <li><Link to="/careers" className="hover:text-indigo-600">Careers</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
                    <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://static.wixstatic.com/media/225ce0_770c0e789f0348bda3ee004f32a8fb0c~mv2.png/v1/crop/x_244,y_190,w_518,h_479/fill/w_108,h_100,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design.png" 
                    alt="Va Core Support Logo" 
                    className="w-6 h-6 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-bold text-zinc-900">Va Core Support</span>
                </div>
                <p className="text-sm text-zinc-400">© 2026 Va Core Support Marketplace. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}
