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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Job Moderation</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Job Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Employer</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Posted</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-zinc-500">Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-zinc-500">No jobs found.</td></tr>
            ) : jobs.map((job) => (
              <tr key={job.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{job.title}</td>
                <td className="px-6 py-4 text-zinc-500">{job.company_name || 'Unknown'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    job.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    job.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-sm">
                  {new Date(job.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <a href={`/jobs/${job.id}`} target="_blank" rel="noreferrer" className="inline-block p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                    <Eye className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => toggleFeatured(job.id, job.is_featured)} 
                    className={`p-2 rounded-lg transition-colors ${job.is_featured ? 'text-amber-500 hover:bg-amber-50' : 'text-zinc-300 hover:bg-zinc-50'}`}
                    title={job.is_featured ? 'Unfeature' : 'Feature'}
                  >
                    <Star className={`w-4 h-4 ${job.is_featured ? 'fill-amber-500' : ''}`} />
                  </button>
                  {job.status === 'pending' && (
                    <>
                      <button onClick={() => approveJob(job.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => rejectJob(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
