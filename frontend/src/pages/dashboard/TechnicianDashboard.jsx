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
    <div className="space-y-8 min-h-screen bg-blue-50 p-8 -m-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">Assigned Tasks</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">You have 2 tickets requiring immediate attention.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-blue-100 shadow-sm md:bg-transparent md:p-0 md:border-none md:shadow-none">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700 shadow-sm">
                T{i}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 font-medium ml-2">Technician Team Beta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Ticket List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Current Queue</h2>
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  <Ticket className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{ticket.id}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      ticket.priority === 'HIGH' ? 'bg-rose-500 animate-pulse' : ticket.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mt-0.5 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>4 Updates</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-100 sm:border-none">
                <StatusBadge status={ticket.status} />
                <button className="p-2 bg-slate-50 border border-slate-200 shadow-sm rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats & Tools */}
        <div className="space-y-6">
          <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Queue Health</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Response</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">12<span className="text-xs text-slate-500 ml-1">min</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolved Today</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">18</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
            <Ticket className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 rotate-12 group-hover:scale-110 transition-transform text-blue-200" />
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4 border-l-2 border-blue-400 pl-3">Contact System Administration if you notice anomalous ticket patterns.</p>
            <button className="w-full py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
              Request Guidance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
