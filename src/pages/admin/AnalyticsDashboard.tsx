import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
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

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Platform Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              User Growth (Last 30 Days)
            </h3>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {data?.userGrowth?.length ? data.userGrowth.map((day: any, i: number) => {
              const max = Math.max(...data.userGrowth.map((d: any) => d.count));
              const height = max > 0 ? (day.count / max) * 100 : 0;
              return (
                <div key={i} className="w-full bg-teal-100 rounded-t-sm relative group" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {day.date}: {day.count} users
                  </div>
                </div>
              );
            }) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">Not enough data</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Revenue (Last 30 Days)
            </h3>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {data?.revenue?.length ? data.revenue.map((day: any, i: number) => {
              const max = Math.max(...data.revenue.map((d: any) => d.total));
              const height = max > 0 ? (day.total / max) * 100 : 0;
              return (
                <div key={i} className="w-full bg-green-100 rounded-t-sm relative group" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {day.date}: ${day.total}
                  </div>
                </div>
              );
            }) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">Not enough data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
