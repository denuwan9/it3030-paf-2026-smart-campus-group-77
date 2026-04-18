import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, AlertTriangle, CheckCircle2, Search, Filter, Loader2, MessageSquare, MapPin } from 'lucide-react';
import { TicketBadge, PriorityBadge } from '../../components/tickets/TicketUI';
import ticketService from '../../services/ticketService';
import userService from '../../services/userService';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminGlobalQueue = () => {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, usersRes] = await Promise.all([
        ticketService.getGlobalQueue(),
        userService.getAllUsers()
      ]);
      setTickets(ticketsRes.data.data);
      // Filter for technicians or admins who can work
      const techList = usersRes.data.data.filter(u => u.role === 'ROLE_TECHNICIAN' || u.role === 'ROLE_ADMIN');
      setTechnicians(techList);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to sync queue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (ticketId, techId) => {
    try {
      await ticketService.assignTechnician(ticketId, techId);
      toast.success('Technician assigned successfully');
      setAssigningId(null);
      fetchData();
    } catch (err) {
      toast.error('Assignment failed');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nexer-text-header">Global Operations Queue</h1>
        <p className="text-nexer-text-muted text-xs sm:text-sm mt-1 font-medium">Campus-wide incident management and technician dispatch.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-nexer-md">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search global tickets..."
              className="w-full pl-11 pr-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-nexer-brand-primary/5 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-white transition-all">
              <Filter className="w-4 h-4" />
              Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-nexer-brand-primary animate-spin" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Global Queue...</p>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reporter</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Incident Detail</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority & Location</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200 shadow-sm">
                          {ticket.reporterName?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-nexer-text-header">{ticket.reporterName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="max-w-xs">
                        <p className="text-sm font-black text-nexer-text-header mb-1">{ticket.category}</p>
                        <p className="text-xs text-nexer-text-muted line-clamp-1 font-medium">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <PriorityBadge priority={ticket.priority} />
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {ticket.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <TicketBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-6">
                      {assigningId === ticket.id ? (
                        <select 
                          autoFocus
                          onBlur={() => setAssigningId(null)}
                          onChange={(e) => handleAssign(ticket.id, e.target.value)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-nexer-brand-primary outline-none ring-4 ring-nexer-brand-primary/5 bg-white"
                        >
                          <option value="">Select Tech</option>
                          {technicians.map(t => (
                            <option key={t.id} value={t.id}>{t.fullName}</option>
                          ))}
                        </select>
                      ) : (
                        <button 
                          onClick={() => setAssigningId(ticket.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            ticket.technicianName 
                              ? 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300' 
                              : 'bg-nexer-brand-primary/5 border-nexer-brand-primary/10 text-nexer-brand-primary hover:bg-nexer-brand-primary/10'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          {ticket.technicianName || 'Assign Tech'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-nexer-brand-primary hover:text-white transition-all shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGlobalQueue;
