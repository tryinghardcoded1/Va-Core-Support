import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, CreditCard, 
  FileText, BarChart3, Settings, ShieldCheck, LogOut, Menu, X, DollarSign
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

export default function AdminLayout({ user }: { user: any }) {
  console.log('AdminLayout rendering', { user });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { path: '/admin/payments', icon: DollarSign, label: 'Payments' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/roles', icon: ShieldCheck, label: 'Roles & Permissions' },
    { path: '/admin/audit-logs', icon: FileText, label: 'Audit Logs' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-zinc-900 text-white flex flex-col transition-all duration-300 z-20"
      >
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          {sidebarOpen && <span className="font-bold text-xl tracking-tight text-teal-400">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-teal-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-3 w-full text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Exit Admin</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-zinc-900 capitalize">
            {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-600">Admin: {user?.name}</span>
            <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview user={user} />} />
            <Route path="users" element={<UsersManager user={user} />} />
            <Route path="jobs" element={<JobsManager user={user} />} />
            <Route path="subscriptions" element={<SubscriptionsManager user={user} />} />
            <Route path="payments" element={<PaymentsManager user={user} />} />
            <Route path="reports" element={<ReportsManager user={user} />} />
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
