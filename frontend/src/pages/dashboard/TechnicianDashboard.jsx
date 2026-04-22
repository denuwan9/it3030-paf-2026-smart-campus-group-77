import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, MessageSquare, ChevronRight, Wrench } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const TechnicianDashboard = () => {
  // Empty state for maintenance tasks
  const tasks = [];

  return (
    <div className="space-y-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 uppercase">Assigned Maintenance</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">Manage your assigned technical and facility tasks.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-nexer-sm md:bg-transparent md:p-0 md:border-none md:shadow-none">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-blue-700 shadow-sm uppercase">
                T{i}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Technician Team Beta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Task List Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Current Queue</h2>
          
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">All Caught Up!</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs font-medium">
              There are currently no active maintenance tasks or incident reports assigned to your queue.
            </p>
          </div>
        </div>

        {/* Quick Stats & Tools */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-nexer-sm">
            <h2 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Queue Health</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Response</p>
                <p className="text-2xl font-black text-slate-800 mt-1">--<span className="text-xs text-slate-400 ml-1">min</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resolved Today</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">0</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-nexer-lg text-white relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <h3 className="text-xl font-black mb-2 tracking-tight">System Status</h3>
            <p className="text-indigo-100 text-xs mb-6 border-l-2 border-indigo-400 pl-3 font-medium">Contact System Administration if you notice anomalous patterns in campus facilities.</p>
            <button className="w-full py-3 bg-white text-indigo-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-nexer-md">
              Request Guidance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
