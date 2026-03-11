import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function PaymentsManager({ user }: { user: any }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    fetch('/api/admin/payments', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchPayments();
  }, [user.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Payment History</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Transaction ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Employer</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No payments found.</td></tr>
            ) : payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-zinc-500">{payment.id.substring(0, 8)}...</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900">{payment.employer_name}</div>
                  <div className="text-sm text-zinc-500">{payment.employer_email}</div>
                </td>
                <td className="px-6 py-4 font-bold text-zinc-900">${payment.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-sm">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {payment.invoice_url && (
                    <a href={payment.invoice_url} target="_blank" rel="noreferrer" className="inline-block p-2 text-zinc-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                      <Download className="w-4 h-4" />
                    </a>
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
