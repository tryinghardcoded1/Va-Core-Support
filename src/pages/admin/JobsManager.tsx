import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Eye, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function JobsManager({ user }: { user: any }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    fetch('/api/admin/jobs', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchJobs();
  }, [user.id]);

  const approveJob = async (id: string) => {
    if (!confirm('Approve this job?')) return;
    try {
      await fetch('/api/admin/approve-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ id })
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectJob = async (id: string) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    try {
      await fetch('/api/admin/reject-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ id, reason })
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch('/api/admin/toggle-featured-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ id, is_featured: !current })
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900">Jobs Moderation</h2>
      </div>

      <div className="flex bg-zinc-100 p-1 rounded-xl w-fit">
        {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-20 rounded-3xl border border-zinc-200 shadow-sm text-center">
        <p className="text-zinc-400 font-medium">No {activeTab.toLowerCase()} jobs found.</p>
      </div>
    </div>
  );
}
