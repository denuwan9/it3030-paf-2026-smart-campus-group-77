import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, User as UserIcon, 
  Info, Image as ImageIcon, CheckCircle2, XCircle, 
  Loader2, AlertCircle, ShieldAlert
} from 'lucide-react';
import { TicketBadge, PriorityBadge } from '../../components/tickets/TicketUI';
import TicketThread from '../../components/tickets/TicketThread';
import ticketService from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await ticketService.getTicketDetails(id);
      setTicket(res.data.data);
      setResolutionNotes(res.data.data.resolutionNotes || '');
    } catch (err) {
      toast.error('Ticket not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdateLoading(true);
    try {
      await ticketService.updateStatus(id, status, resolutionNotes);
      toast.success(`Status updated to ${status}`);
      fetchDetails();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setUpdateLoading(true);
    try {
      await ticketService.rejectTicket(id, rejectionReason);
      toast.success('Ticket rejected');
      fetchDetails();
    } catch (err) {
      toast.error('Rejection failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-nexer-brand-primary animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving incident data...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isTechnician = user?.role === 'ROLE_TECHNICIAN';
  const isAssigned = ticket?.technicianId === user?.userId;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-nexer-brand-primary transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-nexer-text-header">{ticket.category}</h1>
            <TicketBadge status={ticket.status} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ref: #{ticket.id.toString().substring(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Details Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-nexer-md space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 pl-1">Description</label>
              <p className="text-nexer-text-header font-medium leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {ticket.description}
              </p>
            </div>

            {ticket.attachmentUrls?.length > 0 && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4 pl-1">Attachments</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {ticket.attachmentUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl overflow-hidden border-2 border-white shadow-sm h-32">
                      <img src={url} alt="Attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {ticket.rejectionReason && (
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Rejection Reason</span>
                </div>
                <p className="text-sm font-bold text-red-800">{ticket.rejectionReason}</p>
              </div>
            )}
            
            {ticket.resolutionNotes && (
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Resolution Notes</span>
                </div>
                <p className="text-sm font-bold text-emerald-800">{ticket.resolutionNotes}</p>
              </div>
            )}

            <div className="pt-6 border-t border-slate-50">
              <TicketThread ticketId={id} />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-nexer-md space-y-6">
            <h3 className="text-xs font-black text-nexer-text-header uppercase tracking-widest border-b border-slate-50 pb-4">Incident Metadata</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-sm font-bold text-nexer-text-header">{ticket.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Priority</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reporter</p>
                  <p className="text-sm font-bold text-nexer-text-header">{ticket.reporterName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date Reported</p>
                  <p className="text-sm font-bold text-nexer-text-header">{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role Actions */}
          {(isAdmin || (isTechnician && isAssigned)) && (
            <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-xl space-y-6">
              <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Mission Control</h3>
              
              <div className="space-y-4">
                {ticket.status === 'OPEN' && isAdmin && (
                  <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Admin Actions</p>
                    <textarea 
                      placeholder="Reason for rejection..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500/50"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <button 
                      onClick={handleReject}
                      disabled={updateLoading}
                      className="w-full py-2.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      {updateLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <XCircle className="w-3 h-3"/>}
                      Reject Report
                    </button>
                  </div>
                )}

                {(isTechnician && isAssigned || isAdmin) && ticket.status !== 'RESOLVED' && ticket.status !== 'REJECTED' && (
                  <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Resolution Panel</p>
                    <textarea 
                      placeholder="Add resolution notes..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500/50"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                    />
                    <div className="grid grid-cols-1 gap-2">
                       {ticket.status === 'OPEN' && (
                         <button 
                           onClick={() => handleStatusUpdate('IN_PROGRESS')}
                           className="w-full py-2.5 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20"
                         >
                           Start Progress
                         </button>
                       )}
                       <button 
                         onClick={() => handleStatusUpdate('RESOLVED')}
                         className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                       >
                         Mark as Resolved
                       </button>
                    </div>
                  </div>
                )}
                
                {isAdmin && ticket.status === 'RESOLVED' && (
                   <button 
                    onClick={() => handleStatusUpdate('CLOSED')}
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100"
                  >
                    Archive & Close Ticket
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
