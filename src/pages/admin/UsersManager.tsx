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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">User Management</h2>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600">Joined</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{u.name}</td>
                <td className="px-6 py-4 text-zinc-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    u.role === 'employer' ? 'bg-blue-100 text-blue-700' : 
                    u.role === 'va' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    u.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    u.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-sm">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {u.status !== 'approved' && (
                    <button onClick={() => updateStatus(u.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {u.status !== 'suspended' && (
                    <button onClick={() => updateStatus(u.id, 'suspended')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Suspend">
                      <Ban className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
