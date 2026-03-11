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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Subscription Management</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Employer</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Plan</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Period End</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-zinc-500">Loading...</td></tr>
            ) : subscriptions.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-zinc-500">No subscriptions found.</td></tr>
            ) : subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900">{sub.employer_name}</div>
                  <div className="text-sm text-zinc-500">{sub.employer_email}</div>
                </td>
                <td className="px-6 py-4 font-medium text-zinc-900">{sub.plan_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-sm">
                  {new Date(sub.current_period_end).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-sm font-medium text-teal-600 hover:text-teal-700">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
