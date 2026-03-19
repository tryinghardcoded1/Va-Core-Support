import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, CreditCard, 
  Zap, Palette, FileText, ShieldCheck, BarChart3, 
  LogOut, Menu, X, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

// Import sub-pages
import DashboardOverview from './DashboardOverview';
import UsersManager from './UsersManager';
import JobsManager from './JobsManager';
import SubscriptionsManager from './SubscriptionsManager';
import PaymentsManager from './PaymentsManager';
import ReportsManager from './ReportsManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsManager from './SettingsManager';
import RolesManager from './RolesManager';
import AuditLogs from './AuditLogs';

// Placeholder components for new menus
const Integrations = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold text-zinc-900">Integrations</h2>
      <p className="text-zinc-500">Manage your API keys and third-party integrations.</p>
    </div>
    <div className="grid gap-6">
      {['Stripe API Key', 'PayPal API Key', 'OpenAI API Key', 'Claude API Key', 'Gemini API Key'].map((key) => (
        <div key={key} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-zinc-900">{key}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${key.includes('Stripe') || key.includes('OpenAI') ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                {key.includes('Stripe') || key.includes('OpenAI') ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 font-mono text-sm text-zinc-500">
              {key.includes('Stripe') ? 'sk_live_••••••••••••••••••••••••' : key.includes('OpenAI') ? 'sk-••••••••••••••••••••' : 'Not configured'}
            </div>
          </div>
          <button className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-all">Update</button>
        </div>
      ))}
    </div>
  </div>
);

const Appearance = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-zinc-900">Appearance & Branding</h2>
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
      <p className="text-zinc-500">Customize the look and feel of your platform.</p>
    </div>
  </div>
);

const BlogContent = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-zinc-900">Blog & Content</h2>
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
      <p className="text-zinc-500">Manage your blog posts and site content.</p>
    </div>
  </div>
);

const SkillVerification = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-indigo-600" />
        <h2 className="text-3xl font-bold text-zinc-900">Skill Certification Review</h2>
      </div>
      <div className="flex bg-zinc-100 p-1 rounded-xl">
        {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
          <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'Pending' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>
            {tab}
          </button>
        ))}
      </div>
    </div>
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-zinc-900">Bookkeeping</h4>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pending</span>
          </div>
          <p className="text-sm text-zinc-500">negrite.jan — negrite.jan@gmail.com</p>
          <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Virtual Bookkeeping with Xero and Quickbooks Online Certificate.jpg
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-zinc-600 bg-white border border-zinc-200 rounded-lg"><BarChart3 className="w-4 h-4" /></button>
          <button className="p-2 text-emerald-600 hover:bg-emerald-50 bg-white border border-emerald-200 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>
          <button className="p-2 text-red-600 hover:bg-red-50 bg-white border border-red-200 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminLayout({ user }: { user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { path: '/admin/integrations', icon: Zap, label: 'Integrations' },
    { path: '/admin/appearance', icon: Palette, label: 'Appearance & Branding' },
    { path: '/admin/blog', icon: FileText, label: 'Blog & Content' },
    { path: '/admin/skill-verification', icon: ShieldCheck, label: 'Skill Verification' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-[#111827] text-white flex flex-col transition-all duration-300 z-20 shadow-2xl"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-black text-lg leading-tight">VA Core Support</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admin Panel</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {sidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-600/20">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user?.email || 'admin@vacoresupport.com'}</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:bg-zinc-800/50 hover:text-white rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-bold text-sm">Exit Admin</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-zinc-200 h-20 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
              <Link to="/" className="hover:text-zinc-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-zinc-900 capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/employer" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">My Dashboard</Link>
            <Link to="/jobs" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">POST A JOB</Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-10">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview user={user} />} />
            <Route path="users" element={<UsersManager user={user} />} />
            <Route path="jobs" element={<JobsManager user={user} />} />
            <Route path="subscriptions" element={<SubscriptionsManager user={user} />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="appearance" element={<Appearance />} />
            <Route path="blog" element={<BlogContent />} />
            <Route path="skill-verification" element={<SkillVerification />} />
            <Route path="analytics" element={<AnalyticsDashboard user={user} />} />
            <Route path="settings" element={<SettingsManager user={user} />} />
            <Route path="roles" element={<RolesManager user={user} />} />
            <Route path="audit-logs" element={<AuditLogs user={user} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
