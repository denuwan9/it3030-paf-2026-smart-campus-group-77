import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronRight } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const TechnicianDashboard = () => {
  const tickets = [
    { id: 'TICK-482', title: 'Network Outage - Hall 04', priority: 'HIGH', status: 'IN_PROGRESS', time: '20m ago' },
    { id: 'TICK-485', title: 'Smart Board Driver Issue', priority: 'MEDIUM', status: 'OPEN', time: '45m ago' },
    { id: 'TICK-471', title: 'AC Filter Replacement', priority: 'LOW', status: 'RESOLVED', time: '2h ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Assigned Tasks</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">You have 2 tickets requiring immediate attention.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/50 md:bg-transparent md:p-0 md:border-none">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-400">
                T{i}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium ml-2">Technician Team Beta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Ticket List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Current Queue</h2>
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-primary-500/50 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  ticket.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 font-bold">{ticket.id}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ticket.priority === 'HIGH' ? 'bg-red-500' : ticket.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>4 Updates</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-800 sm:border-none">
                <StatusBadge status={ticket.status} />
                <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats & Tools */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-100 mb-6">Queue Health</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Response</p>
                <p className="text-2xl font-bold text-white mt-1">12<span className="text-xs text-slate-500 ml-1">min</span></p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolved Today</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">18</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-600 p-6 rounded-2xl shadow-lg shadow-primary-500/20 text-white relative overflow-hidden group">
            <Ticket className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 rotate-12 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-primary-100 text-sm mb-4">Contact System Administration if you notice anomalous ticket patterns.</p>
            <button className="w-full py-2 bg-white text-primary-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
              Request Guidance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
