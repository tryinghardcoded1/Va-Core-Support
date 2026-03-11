import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function ReportsManager({ user }: { user: any }) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/admin/reports', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchReports();
  }, [user.id]);

  const resolveReport = async (id: string, status: string) => {
    const notes = prompt('Admin notes for resolution:');
    if (notes === null) return;
    try {
      await fetch(`/api/admin/reports/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ status, admin_notes: notes })
      });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Moderation & Reports</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Reporter</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Target Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Reason</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No reports found.</td></tr>
            ) : reports.map((report) => (
              <tr key={report.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{report.reporter_name}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {report.target_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-700 max-w-xs truncate" title={report.reason}>{report.reason}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                    report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-sm">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {report.status === 'pending' && (
                    <>
                      <button onClick={() => resolveReport(report.id, 'resolved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Resolve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => resolveReport(report.id, 'dismissed')} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg" title="Dismiss">
                        <AlertTriangle className="w-4 h-4" />
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
