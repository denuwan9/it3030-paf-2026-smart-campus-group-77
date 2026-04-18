import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronRight, Loader2, ClipboardList } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import dashboardService from '../../services/dashboardService';
import ticketService from '../../services/ticketService';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const TechnicianDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ activeTasksCount: 0, resolvedTodayCount: 0, avgResponseTime: '15m' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, tasksRes] = await Promise.all([
          dashboardService.getTechnicianStats(),
          ticketService.getTechnicianTasks()
        ]);
        setStats(statsRes.data);
        setTasks(tasksRes.data.data.slice(0, 5)); // Show top 5 recent tasks
      } catch (err) {
        toast.error('Failed to sync dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-nexer-brand-primary animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-nexer-text-header">Mission Overview</h1>
          <p className="text-nexer-text-muted text-xs sm:text-sm mt-1 font-medium italic">
            {stats.activeTasksCount > 0 
              ? `You have ${stats.activeTasksCount} active tasks in your queue.` 
              : "Your queue is clear. Great work!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Ticket List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Queue</h2>
            {tasks.length > 0 && (
              <button 
                onClick={() => navigate('/technician/tasks')}
                className="text-[10px] font-black text-nexer-brand-primary uppercase tracking-widest hover:underline"
              >
                View Full Roster
              </button>
            )}
          </div>
          
          {tasks.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] p-12 text-center flex flex-col items-center gap-4">
              <ClipboardList className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No assigned tasks found</p>
            </div>
          ) : (
            tasks.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-[2rem] p-4 sm:p-5 hover:border-nexer-brand-primary/30 hover:shadow-nexer-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${
                    ticket.status === 'IN_PROGRESS' 
                      ? 'bg-amber-50 text-amber-600' 
                      : 'bg-nexer-brand-primary/10 text-nexer-brand-primary'
                  }`}>
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">#{ticket.id.toString().substring(0, 8)}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        ticket.priority === 'URGENT' ? 'bg-rose-500 animate-pulse' : 
                        ticket.priority === 'HIGH' ? 'bg-rose-500' : 
                        ticket.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                    </div>
                    <h3 className="text-base font-black text-nexer-text-header mt-0.5 group-hover:text-nexer-brand-primary transition-colors">
                      {ticket.category}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(parseISO(ticket.createdAt))} ago</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <AlertCircle className="w-3 h-3" />
                        <span>{ticket.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-50 sm:border-none">
                  <StatusBadge status={ticket.status} />
                  <button 
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="p-3 bg-slate-50 border border-slate-200 shadow-sm rounded-xl text-slate-400 hover:text-white hover:bg-nexer-brand-primary hover:border-nexer-brand-primary transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Quick Stats & Tools */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-nexer-md">
            <h2 className="text-xs font-black text-nexer-text-header uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Response</p>
                  <p className="text-xl font-black text-nexer-text-header mt-1">{stats.avgResponseTime}</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="w-4 h-4 text-nexer-brand-primary" />
                </div>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved Today</p>
                  <p className="text-xl font-black text-emerald-600 mt-1">{stats.resolvedTodayCount}</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
            <Ticket className="absolute -bottom-6 -right-6 w-24 h-24 opacity-10 rotate-12 group-hover:scale-110 transition-transform text-nexer-brand-primary" />
            <h3 className="text-lg font-black mb-3 text-white">Ops Support</h3>
            <p className="text-white/60 text-xs mb-6 leading-relaxed">Need technical guidance or encountering safety hazards? Contact the operations hub immediately.</p>
            <button className="w-full py-3.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-nexer-brand-primary hover:text-white transition-all shadow-lg active:scale-95">
              Contact Ops Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
