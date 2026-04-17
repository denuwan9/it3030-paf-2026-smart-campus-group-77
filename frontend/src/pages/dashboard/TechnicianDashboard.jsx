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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nexer-text-header">Assigned Tasks</h1>
          <p className="text-nexer-text-muted text-xs sm:text-sm mt-1 font-medium">You have 2 tickets requiring immediate attention.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 md:bg-transparent md:p-0 md:border-none shadow-nexer-sm md:shadow-none">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                T{i}
              </div>
            ))}
          </div>
          <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest ml-2">Team Beta</p>
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
              className="bg-white border border-slate-200 rounded-[2.5rem] p-5 sm:p-6 hover:shadow-nexer-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-nexer-sm"
            >
              <div className="flex items-start sm:items-center gap-5">
                <div className={`p-4 rounded-[1.5rem] shadow-sm ${
                  ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
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
                  <h3 className="text-lg font-black text-nexer-text-header mt-0.5 group-hover:text-nexer-brand-primary transition-colors uppercase tracking-tight">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center gap-5 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>4 Updates</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-5 sm:pt-0 border-t border-slate-50 sm:border-none">
                <StatusBadge status={ticket.status} />
                <button className="w-10 h-10 bg-slate-50 rounded-xl text-slate-400 hover:text-white hover:bg-nexer-brand-primary transition-all shadow-sm active:scale-95 flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats & Tools */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-nexer-md">
            <h2 className="text-lg font-black text-nexer-text-header mb-6">Queue Health</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Response</p>
                <p className="text-2xl font-black text-nexer-text-header mt-1 tracking-tight">12<span className="text-xs text-slate-400 ml-1">min</span></p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resolved Today</p>
                <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">18</p>
              </div>
            </div>
          </div>

          <div className="bg-nexer-brand-primary p-8 rounded-[2.5rem] shadow-nexer-lg shadow-nexer-brand-primary/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <Ticket className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-3">Operator Support</h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">Contact System Administration if you detect anomalous patterns.</p>
              <button className="w-full py-3 bg-white text-nexer-brand-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-xl active:scale-95 shadow-nexer-brand-primary/20">
                Request Guidance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
