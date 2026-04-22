import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, MapPin, Loader2, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { TicketBadge, PriorityBadge } from '../../components/tickets/TicketUI';
import ticketService from '../../services/ticketService';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TechnicianTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await ticketService.getTechnicianTasks();
      setTasks(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nexer-text-header">My Work Orders</h1>
        <p className="text-nexer-text-muted text-xs sm:text-sm mt-1 font-medium">Assigned incidents and maintenance tasks requiring your attention.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-slate-200 rounded-3xl shadow-nexer-md">
          <Loader2 className="w-10 h-10 text-nexer-brand-primary animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preparing Tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-nexer-md">
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6">
            <ClipboardList className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-lg font-black text-nexer-text-header mb-2">No Active Work Orders</h3>
          <p className="text-slate-400 text-sm max-w-xs font-medium">Excellent work! You've cleared your assigned tasks. New incidents will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-nexer-md group cursor-pointer"
              onClick={() => navigate(`/tickets/${task.id}`)}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{task.id.toString().substring(0, 8)}</span>
                  <TicketBadge status={task.status} />
                </div>

                <div>
                  <h3 className="text-lg font-black text-nexer-text-header line-clamp-1">{task.category}</h3>
                  <p className="text-xs text-nexer-text-muted mt-1 font-medium line-clamp-2">{task.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                    <MapPin className="w-4 h-4 text-nexer-brand-primary" />
                    {task.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Assigned {formatDistanceToNow(parseISO(task.updatedAt || task.createdAt))} ago
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <PriorityBadge priority={task.priority} />
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-nexer-brand-primary group-hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianTasks;
