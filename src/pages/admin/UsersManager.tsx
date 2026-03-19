import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Shield, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function UsersManager({ user }: { user: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/admin/users?search=${search}`, {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delay);
  }, [search, user.id]);

  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
    try {
      await fetch('/api/admin/update-user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ id, status })
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ id })
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const [activeTab, setActiveTab] = useState<'Employers' | 'Workers'>('Employers');

  const sampleUsers = [
    { company: 'TechStartup Inc.', email: 'hr@techstartup.com', plan: 'Premium', jobs: 5, status: 'Active' },
    { company: 'Digital Agency Co.', email: 'team@digitalagency.com', plan: 'Pro', jobs: 3, status: 'Active' },
    { company: 'E-commerce Brand', email: 'ops@ecommerce.com', plan: 'Free', jobs: 1, status: 'Active' },
    { company: 'SaaS Company', email: 'hire@saas.com', plan: 'Premium', jobs: 8, status: 'Suspended' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900">User Management</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          {['Employers', 'Workers'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Plan</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Jobs Posted</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sampleUsers.map((u, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-8 py-5 text-sm font-bold text-zinc-900">{u.company}</td>
                <td className="px-8 py-5 text-sm text-zinc-500">{u.email}</td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider ${
                    u.plan === 'Premium' ? 'bg-indigo-50 text-indigo-600' :
                    u.plan === 'Pro' ? 'bg-blue-50 text-blue-600' :
                    'bg-zinc-100 text-zinc-500'
                  }`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500">{u.jobs}</td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-red-600 bg-zinc-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
