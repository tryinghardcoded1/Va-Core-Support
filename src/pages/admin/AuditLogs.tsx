import React, { useState, useEffect } from 'react';
import { FileText, Clock, User, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuditLogs({ user }: { user: any }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [user.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">System Audit Logs</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Admin</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Action</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Description</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-zinc-500">Loading audit logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-zinc-500">No logs found.</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {log.admin_name?.charAt(0) || 'A'}
                    </div>
                    <span className="font-medium text-zinc-900">{log.admin_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {log.action_type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-600 text-sm max-w-md truncate" title={log.description}>
                  {log.description}
                </td>
                <td className="px-6 py-4 text-zinc-500 text-sm flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
