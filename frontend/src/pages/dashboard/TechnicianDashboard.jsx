import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Ticket, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronRight, Loader2, ClipboardList, Shield, Zap } from 'lucide-react';

import StatusBadge from '../../components/StatusBadge';
import StatCard from '../../components/StatCard';
import dashboardService from '../../services/dashboardService';
import ticketService from '../../services/ticketService';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

// ─── Ticket Card Sub-component ───────────────────────────────────────────────

const TicketCard = ({ ticket, index, onClick }) => {
  const priorityConfig = {
    URGENT: { dot: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600', label: 'Urgent' },
    HIGH: { dot: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', label: 'High' },
    MEDIUM: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', label: 'Medium' },
    LOW: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Low' },
  };

  const config = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:border-nexer-brand-primary/30 hover:shadow-nexer-lg transition-all cursor-pointer overflow-hidden"
    >
      {/* Accent Background Glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${config.bg}`} />

      <div className="flex flex-col h-full justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{ticket.id.toString().substring(0, 8)}</span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                <div className={`w-1 h-1 rounded-full ${config.dot}`} />
                <span className="text-[9px] font-black uppercase tracking-wider">{config.label}</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-nexer-brand-primary transition-colors line-clamp-1">
              {ticket.category}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {ticket.location}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-nexer-brand-primary group-hover:text-white transition-all shadow-inner">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400">{formatDistanceToNow(parseISO(ticket.createdAt))} ago</span>
            </div>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Dashboard Component ──────────────────────────────────────────────────

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
        setTasks(tasksRes.data.data.slice(0, 5));
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
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Operations...</p>
      </div>
    );
  }

  const technicianStats = [
    { 
      label: 'Active Queue', 
      value: stats.activeTasksCount || '0', 
      icon: Ticket, 
      colorClass: 'bg-amber-500', 
      description: 'Tasks currently in progress' 
    },
    { 
      label: 'Resolved Today', 
      value: stats.resolvedTodayCount || '0', 
      icon: CheckCircle, 
      colorClass: 'bg-emerald-500', 
      description: 'Completed in the last 24h' 
    },
    { 
      label: 'Response Time', 
      value: stats.avgResponseTime || '—', 
      icon: Zap, 
      colorClass: 'bg-blue-500', 
      description: 'Average ticket pick-up speed' 
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header & Quick Stats */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">Operations Hub</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium italic max-w-lg">
            Real-time synchronization for campus maintenance and facility safety reports.
          </p>
        </div>

        <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {technicianStats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Tasks */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Priority Queue
            </h2>
            <button 
              onClick={() => navigate('/technician/tasks')}
              className="text-[10px] font-black text-nexer-brand-primary uppercase tracking-widest hover:underline flex items-center gap-1 group"
            >
              Full Roster <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-200 border-dashed rounded-[3rem] py-24 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-slate-200" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Clear Horizon</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">No active maintenance tasks assigned to your station.</p>
                </div>
              </div>
            ) : (
              tasks.map((ticket, i) => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  index={i} 
                  onClick={() => navigate(`/tickets/${ticket.id}`)} 
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar: System Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Shield className="w-24 h-24 rotate-12" />
            </div>
            <h3 className="text-xl font-black mb-4 text-white">System Protocol</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed font-medium">
              Maintain operational transparency. Update ticket statuses in real-time to ensure campus safety metrics remain accurate.
            </p>
            <div className="space-y-4">
              <button className="w-full py-4 bg-white text-slate-900 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-nexer-brand-primary hover:text-white transition-all shadow-lg active:scale-95">
                Contact Ops Hub
              </button>
              <button 
                onClick={() => navigate('/facilities')}
                className="w-full py-4 bg-slate-800 text-white/80 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-700 transition-all active:scale-95 border border-white/5"
              >
                Facility Registry
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-nexer-sm">
            <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-50 pb-4">Efficiency</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-slate-400">Response Speed</span>
                  <span className="text-nexer-brand-primary">{stats.avgResponseTime}</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-nexer-brand-primary w-[75%]" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">
                Your response time is 15% faster than the team average this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
