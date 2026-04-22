import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Ticket, Search, Filter, Loader2, MessageSquare, MapPin, X } from 'lucide-react';
import IncidentReportForm from '../../components/tickets/IncidentReportForm';
import { TicketBadge, PriorityBadge } from '../../components/tickets/TicketUI';
import ticketService from '../../services/ticketService';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketService.getMyTickets();
      setTickets(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nexer-text-header">My Incident Reports</h1>
          <p className="text-nexer-text-muted text-xs sm:text-sm mt-1 font-medium">Track and manage your campus maintenance requests.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-nexer-brand-primary text-white text-sm font-bold rounded-xl hover:bg-opacity-90 shadow-nexer-lg shadow-nexer-brand-primary/20 transition-all flex items-center justify-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel Report' : 'Report Incident'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-nexer-md mb-8">
              <h2 className="text-lg font-black text-nexer-text-header mb-6">New Incident Report</h2>
              <IncidentReportForm onSuccess={() => {
                setShowForm(false);
                fetchTickets();
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-nexer-md">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search my tickets..."
              className="w-full pl-11 pr-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-nexer-brand-primary/5 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-white transition-all">
            <Filter className="w-4 h-4" />
            Category
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-nexer-brand-primary animate-spin" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading your queue...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                <Ticket className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-nexer-text-header mb-2">No tickets found</h3>
              <p className="text-slate-400 text-sm max-w-xs font-medium">You haven't reported any incidents yet. All your maintenance requests will appear here.</p>
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24">ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Incident Detail</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">#{ticket.id.toString().substring(0, 8)}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div>
                        <p className="text-sm font-black text-nexer-text-header mb-1">{ticket.category}</p>
                        <p className="text-xs text-nexer-text-muted line-clamp-1 font-medium">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {ticket.location}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-6">
                      <TicketBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-nexer-brand-primary hover:text-white transition-all"
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

export default UserTickets;
