import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function AnalyticsDashboard({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(console.error);
  }, [user.id]);

  const statCards = [
    { label: 'Total Revenue', value: '$12,450.00', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'New Users', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Jobs', value: '45', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900">Platform Analytics</h2>
        <div className="flex items-center gap-2 bg-white border border-zinc-200 p-1 rounded-xl">
          {['7D', '30D', '90D', '1Y'].map((range) => (
            <button key={range} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${range === '30D' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-zinc-900 mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-zinc-900">User Growth</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-xs font-bold text-zinc-500">New Users</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-3">
            {[40, 65, 45, 80, 55, 90, 70].map((val, i) => (
              <div key={i} className="flex-1 bg-blue-500/10 rounded-t-xl relative group" style={{ height: `${val}%` }}>
                <div className="absolute inset-0 bg-blue-500 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-zinc-900">Revenue by Plan</h3>
          </div>
          <div className="flex items-center justify-center h-64 relative">
            <div className="w-48 h-48 rounded-full border-[20px] border-zinc-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-black text-zinc-900">$12.4k</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</p>
              </div>
            </div>
            {/* Simple pie segments visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-48 h-48 rounded-full border-[20px] border-transparent border-t-indigo-500 border-r-indigo-500 -rotate-45"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">65%</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Premium</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">25%</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pro</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">10%</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Free</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
