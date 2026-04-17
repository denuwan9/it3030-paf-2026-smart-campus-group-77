import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, User, Calendar, MapPin, Tag, Shield, Phone, Send } from 'lucide-react';

const TicketDetailsSidebar = ({ isOpen, onClose, ticket }) => {
  if (!ticket) return null;

  const mockComments = [
    {
      id: 1,
      user: 'Kavindu Silva',
      role: 'USER',
      time: 'Apr 7, 9:12 AM',
      message: 'Tried the remote and direct button — no response at all.',
      initials: 'KS'
    },
    {
      id: 2,
      user: 'Ashan Perera',
      role: 'TECHNICIAN',
      time: 'Apr 8, 11:00 AM',
      message: 'Checked fuse — blown. Replacement ordered, ETA 2 days.',
      initials: 'AP',
      isTechnician: true
    }
  ];

  const statuses = ['Open', 'In progress', 'Resolved', 'Closed'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-[#1f1f1f] border-l border-white/5 z-[120] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#1f1f1f]/80 backdrop-blur-xl z-10 flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white text-lg font-black tracking-tight flex items-center gap-3">
                <span className="text-slate-500">{ticket.id} —</span>
                {ticket.title}
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-[#2b2b2b] hover:bg-[#363636] flex items-center justify-center rounded-xl text-slate-400 transition-colors border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8 pb-20">
              {/* Workflow */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Workflow</p>
                <div className="flex bg-[#181818] p-1.5 rounded-2xl border border-white/5 gap-1">
                  {statuses.map((s) => {
                    const isActive = ticket.status.replace('_', ' ').toLowerCase() === s.toLowerCase();
                    return (
                      <button 
                        key={s} 
                        className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          isActive 
                            ? 'bg-[#10b981]/10 text-[#10b981] ring-1 ring-[#10b981]/30 ring-inset' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Location', value: ticket.location, icon: MapPin },
                  { label: 'Category', value: ticket.category, icon: Tag },
                  { label: 'Priority', value: ticket.priority, icon: Shield },
                  { label: 'Created', value: '2026-04-07', icon: Calendar },
                  { label: 'Contact', value: 'ext. 4421', icon: Phone },
                  { label: 'Assignee', value: 'Ashan Perera', icon: User },
                ].map((item) => (
                  <div key={item.label} className="bg-[#181818] border border-white/5 p-3 rounded-xl transition-all hover:bg-white/[0.02]">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-200">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Attachments */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Attachments</p>
                <div className="flex gap-3">
                  {[1, 2].map(i => (
                    <div key={i} className="w-16 h-16 bg-[#181818] border border-white/5 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-500 hover:border-white/10 transition-all cursor-pointer">
                      <Tag className="w-5 h-5 opacity-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Assign Technician */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Assign Technician</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className="w-full bg-[#181818] border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs font-bold outline-none appearance-none">
                      <option>Ashan Perera</option>
                      <option>Lilantha Siriwardana</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                  <button className="px-6 py-2.5 bg-[#2b2b2b] border border-white/5 text-white text-xs font-black uppercase rounded-xl hover:bg-[#363636] transition-all active:scale-95 shadow-lg shadow-black/20">
                    Assign
                  </button>
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-4 pt-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Update Status</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className="w-full bg-[#181818] border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs font-bold outline-none appearance-none">
                      <option>In progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                  <button className="px-6 py-2.5 bg-[#2b2b2b] border border-white/5 text-white text-xs font-black uppercase rounded-xl hover:bg-[#363636] transition-all active:scale-95 shadow-lg shadow-black/20">
                    Update
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Comments</p>
                <div className="space-y-4">
                  {mockComments.map(comment => (
                    <div key={comment.id} className="group">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border border-white/5 ${comment.isTechnician ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#2b2b2b] text-slate-300'}`}>
                          {comment.initials}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-200">{comment.user}</span>
                            <span className="text-[9px] font-black text-slate-600 bg-white/5 px-1.5 py-0.5 rounded tracking-widest">{comment.role}</span>
                            <span className="text-[9px] text-slate-600 ml-auto">{comment.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">{comment.message}</p>
                          {comment.isTechnician && (
                            <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded-lg transition-all">Edit</button>
                              <button className="text-[9px] font-black text-rose-500/80 hover:text-rose-400 uppercase tracking-widest px-3 py-1 bg-rose-500/5 border border-rose-500/10 rounded-lg transition-all">Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="pt-6 relative">
                  <textarea 
                    placeholder="Add a comment..."
                    className="w-full bg-[#181818] border border-white/5 rounded-2xl p-4 pr-16 text-xs text-white outline-none focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-600 resize-none h-20"
                  ></textarea>
                  <button className="absolute right-3 bottom-3 p-2 bg-[#2b2b2b] hover:bg-amber-500/90 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95 border border-white/5 shadow-lg group">
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TicketDetailsSidebar;
