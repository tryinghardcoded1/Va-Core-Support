import React, { useState } from 'react';
import { Shield, ShieldCheck, Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'motion/react';

export default function RolesManager({ user }: { user: any }) {
  const [roles, setRoles] = useState([
    { name: 'admin', permissions: ['can_manage_users', 'can_manage_jobs', 'can_manage_payments', 'can_manage_reports', 'can_manage_settings'] },
    { name: 'moderator', permissions: ['can_manage_users', 'can_manage_jobs', 'can_manage_reports'] },
    { name: 'support', permissions: ['can_manage_users', 'can_manage_reports'] },
  ]);

  const allPermissions = [
    'can_manage_users',
    'can_manage_jobs',
    'can_manage_payments',
    'can_manage_reports',
    'can_manage_settings',
    'can_manage_roles',
    'can_view_audit_logs'
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Roles & Permissions</h2>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100">
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 capitalize">{role.name}</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-zinc-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((p, pi) => (
                  <span key={pi} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium border border-zinc-200">
                    {p.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">Available Permissions Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allPermissions.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-sm font-medium text-zinc-700 capitalize">{p.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
