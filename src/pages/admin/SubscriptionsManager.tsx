import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function SubscriptionsManager({ user }: { user: any }) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = () => {
    setLoading(true);
    fetch('/api/admin/subscriptions', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setSubscriptions(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user.id]);

  const [activeTab, setActiveTab] = useState<'Active' | 'Expired' | 'All'>('Active');

  const sampleSubscriptions = [
    { user: 'Maria Santos', plan: 'Premium', start: 'Mar 1, 2026', end: 'Apr 1, 2026', status: 'Active' },
    { user: 'James Rivera', plan: 'Pro', start: 'Feb 15, 2026', end: 'Mar 15, 2026', status: 'Active' },
    { user: 'Digital Agency', plan: 'Premium', start: 'Jan 1, 2026', end: 'Feb 1, 2026', status: 'Expired' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900">Subscription Management</h2>
      </div>

      <div className="flex bg-zinc-100 p-1 rounded-xl w-fit">
        {['Active', 'Expired', 'All'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">User</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Plan</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Start Date</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">End Date</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sampleSubscriptions.map((sub, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-8 py-5 text-sm font-bold text-zinc-900">{sub.user}</td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider ${
                    sub.plan === 'Premium' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {sub.plan}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500">{sub.start}</td>
                <td className="px-8 py-5 text-sm text-zinc-500">{sub.end}</td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    sub.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-red-600 bg-zinc-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
