import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../../components/StatCard';
import { Package, Calendar, ArrowUpRight, TrendingUp, Users, Loader2, Building2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import dashboardService from '../../services/dashboardService';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getRecentActivity()
        ]);
        setStatsData(statsRes.data);
        setActivityData(activityRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Facilities', value: statsData?.totalFacilities || '0', icon: Building2, colorClass: 'bg-indigo-500', trend: 0 },
    { label: 'Total Resources', value: statsData?.totalResources || '0', icon: Package, colorClass: 'bg-blue-500', trend: 0 },
    { label: 'Active Bookings', value: statsData?.activeBookings || '0', icon: Calendar, colorClass: 'bg-amber-500', trend: 0 },

    { label: 'Active Users', value: statsData?.activeUsers || '0', icon: Users, colorClass: 'bg-emerald-500', trend: 0 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nexer-text-header">Operations Overview</h1>
          <p className="text-nexer-text-muted text-xs sm:text-sm mt-1 font-medium">Real-time metrics and campus-wide management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-nexer-text-header text-sm font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-nexer-sm">
            Generate Report
          </button>
          <button className="px-5 py-2.5 bg-nexer-brand-primary text-white text-sm font-bold rounded-xl hover:bg-opacity-90 shadow-nexer-lg shadow-nexer-brand-primary/20 transition-all active:scale-95">
            Add Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-nexer-md">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-nexer-text-header flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-nexer-brand-primary" />
              Recent Activity
            </h2>
            <button className="text-xs text-nexer-brand-primary hover:text-opacity-80 font-black tracking-wider uppercase group flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <div className="table-responsive">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-nexer-brand-primary animate-spin" />
              </div>
            ) : activityData.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-medium">No recent activity</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activityData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200 shadow-sm overflow-hidden">
                            {row.user?.split(' ').map(n => n[0]).join('') || '?'}
                          </div>
                          <span className="text-sm font-bold text-nexer-text-header">{row.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-nexer-text-header">Campus Activity</p>
                        <p className="text-xs text-nexer-text-muted font-medium mt-0.5">{row.title}</p>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                        {row.timestamp ? formatDistanceToNow(new Date(row.timestamp), { addSuffix: true }) : '—'}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-nexer-md">
            <h2 className="text-lg font-black text-nexer-text-header mb-6">System Health</h2>
            <div className="space-y-6">
              {[
                { label: 'Database Sync', progress: 85, status: 'Active' },
                { label: 'Cloud Storage', progress: 100, status: 'Healthy' },
                { label: 'API Gateway', progress: 30, status: 'Under Load' },
              ].map((task, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-nexer-text-header font-black uppercase tracking-wider">{task.label}</span>
                    <span className={`font-bold ${task.status === 'Healthy' ? 'text-emerald-600' : 'text-slate-400'}`}>{task.status}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      className="h-full bg-nexer-brand-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-sm active:scale-[0.98]">
              Run System Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
