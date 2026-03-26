import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../../components/StatCard';
import { Package, Calendar, Ticket, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Resources', value: '124', icon: Package, colorClass: 'bg-primary-500', trend: 12 },
    { label: 'Active Bookings', value: '42', icon: Calendar, colorClass: 'bg-amber-500', trend: 5 },
    { label: 'Pending Tickets', value: '8', icon: Ticket, colorClass: 'bg-red-500', trend: -2 },
    { label: 'Active Users', value: '1.2k', icon: Users, colorClass: 'bg-emerald-500', trend: 8 },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Requested Booking', target: 'Lab 3', time: '2 mins ago', status: 'PENDING' },
    { id: 2, user: 'Sarah Smith', action: 'Reported Incident', target: 'AC Fault - Hall B', time: '15 mins ago', status: 'OPEN' },
    { id: 3, user: 'System', action: 'Maintenance Completed', target: 'Server Room', time: '1 hour ago', status: 'RESOLVED' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time metrics and campus-wide management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all">
            Add Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Recent Activity
            </h2>
            <button className="text-xs text-primary-400 hover:text-primary-300 font-semibold group flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Activity</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentActivities.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                          {row.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-200">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{row.action}</p>
                      <p className="text-xs text-slate-500 tracking-tight mt-0.5">{row.target}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.time}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-100 mb-4">System Tasks</h2>
            <div className="space-y-4">
              {[
                { label: 'Database Backup', progress: 85, status: 'Processing' },
                { label: 'Security Scan', progress: 100, status: 'Completed' },
                { label: 'Token Cleanup', progress: 30, status: 'In Queue' },
              ].map((task, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{task.label}</span>
                    <span className="text-slate-500">{task.status}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      className="h-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
