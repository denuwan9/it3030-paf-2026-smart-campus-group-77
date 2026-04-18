import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, User, Calendar, MapPin, Tag, Shield, Phone, Send, Edit, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketDetailsSidebar = ({ isOpen, onClose, ticket, isEditMode, setIsEditMode, onUpdateTicket }) => {
  if (!ticket) return null;

  const initialComments = [
    {
      id: 1,
      user: 'Lakmal',
      role: 'USER',
      time: 'Apr 7, 9:12 AM',
      message: 'Tried the remote and direct button — no response at all.',
      initials: 'L'
    },
    {
      id: 2,
      user: 'Chanith',
      role: 'USER',
      time: 'Apr 7, 10:45 AM',
      message: 'It seems there is a power issue, checked the main switch too.',
      initials: 'C'
    },
    {
      id: 3,
      user: 'Dhananji',
      role: 'TECHNICIAN',
      time: 'Apr 8, 11:00 AM',
      message: 'Checked fuse — blown. Replacement ordered, ETA 2 days.',
      initials: 'D',
      isTechnician: true
    }
  ];

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [assignee, setAssignee] = useState("Dhananji");
  const [activeStatus, setActiveStatus] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editData, setEditData] = useState({
    location: '', category: '', priority: '', contact: 'ext. 4421'
  });

  // Reset comments or fetch them when ticket changes
  useEffect(() => {
    setNewComment("");
    if (ticket) {
      // Use comments from ticket if they exist, otherwise use initial demo comments
      setComments(ticket.comments || initialComments);
      setActiveStatus(ticket.status);
      setEditData({
        location: ticket.location || '',
        category: ticket.category || 'Equipment',
        priority: ticket.priority || 'MEDIUM',
        contact: ticket.contact || 'ext. 4421'
      });
    }
  }, [ticket]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const initials = assignee.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const comment = {
      id: Date.now(),
      user: assignee,
      role: 'TECHNICIAN',
      time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
      message: newComment,
      initials: initials,
      isTechnician: true,
      isOwn: true // Flag to identify own comments
    };
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment("");
    onUpdateTicket?.(ticket.id, { 
      comments: updatedComments,
      commentsCount: updatedComments.length 
    });
  };

  const handleDeleteComment = (id) => {
    const updatedComments = comments.filter(c => c.id !== id);
    setComments(updatedComments);
    toast.success("Comment deleted");
    onUpdateTicket?.(ticket.id, { 
      comments: updatedComments,
      commentsCount: updatedComments.length 
    });
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.message);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    const updatedComments = comments.map(c => c.id === id ? { ...c, message: editingText } : c);
    setComments(updatedComments);
    setEditingCommentId(null);
    setEditingText("");
    toast.success("Comment updated");
    onUpdateTicket?.(ticket.id, { 
      comments: updatedComments,
      commentsCount: updatedComments.length 
    });
  };

  const statuses = ['Open', 'In progress', 'Resolved', 'Closed'];

  const handleAssign = () => {
    toast.success(`Ticket assigned to ${assignee} successfully`);
  };

  const handleStatusChange = (newStatus) => {
    // Generate the UPPER_CASE format that matches backend, e.g. "IN_PROGRESS"
    const formattedStatus = newStatus.replace(' ', '_').toUpperCase();
    setActiveStatus(formattedStatus);
    toast.success(`Ticket status updated to ${newStatus}`);
    onUpdateTicket?.(ticket.id, { status: formattedStatus });
  };

  const handleEditDataChange = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveTicket = () => {
    // Trim values to ensure they aren't just whitespace
    const updatedData = {
      ...editData,
      location: editData.location.trim(),
      contact: editData.contact.trim()
    };

    if (!updatedData.location || !updatedData.contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    // 1. Notify parent to update the ticket data
    onUpdateTicket?.(ticket.id, updatedData);
    
    // 2. Exit edit mode and close the sidebar
    setIsEditMode?.(false);
    onClose?.();
    
    // 3. Show success message
    toast.success('Ticket updated successfully');
  };

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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-blue-50 border-l border-blue-100 z-[120] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-blue-50/90 backdrop-blur-xl z-10 flex items-center justify-between p-6 border-b border-blue-100">
              <h2 className="text-slate-800 text-lg font-black tracking-tight flex items-center gap-3">
                <span className="text-blue-500">{ticket.id} —</span>
                {ticket.title}
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-white hover:bg-rose-50 flex items-center justify-center rounded-xl text-slate-500 hover:text-rose-500 transition-colors border border-blue-200 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8 pb-20">
              {/* Workflow */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Workflow</p>
                <div className="flex bg-white p-1.5 rounded-2xl border border-blue-100 gap-1 shadow-sm">
                  {statuses.map((s) => {
                    const isActive = activeStatus && activeStatus.replace('_', ' ').toLowerCase() === s.toLowerCase();
                    return (
                      <button 
                        key={s} 
                        onClick={() => handleStatusChange(s)}
                        className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          isActive 
                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300 ring-inset shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
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
                  { key: 'location', label: 'Location', value: isEditMode ? editData.location : (editData.location || ticket.location), icon: MapPin, type: 'text' },
                  { key: 'category', label: 'Category', value: isEditMode ? editData.category : (editData.category || ticket.category), icon: Tag, type: 'select', opts: ['Electrical', 'Plumbing', 'Network', 'Equipment', 'Safety'] },
                  { key: 'priority', label: 'Priority', value: isEditMode ? editData.priority : (editData.priority || ticket.priority), icon: Shield, type: 'select', opts: ['HIGH', 'MEDIUM', 'LOW'] },
                  { key: 'created', label: 'Created', value: '2026-04-07', icon: Calendar, type: 'readonly' },
                  { key: 'contact', label: 'Contact', value: isEditMode ? editData.contact : editData.contact, icon: Phone, type: 'text' },
                  { key: 'assignee', label: 'Assignee', value: 'Dhananji', icon: User, type: 'readonly' },
                ].map((item) => (
                  <div key={item.key} className="bg-white border border-blue-100 p-3 rounded-xl transition-all hover:border-blue-200 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                    {isEditMode && item.type === 'text' ? (
                      <input 
                        type="text" 
                        value={item.value} 
                        onChange={e => handleEditDataChange(item.key, e.target.value)}
                        className="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-blue-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                      />
                    ) : isEditMode && item.type === 'select' ? (
                      <select 
                        value={item.value} 
                        onChange={e => setEditData({...editData, [item.key]: e.target.value})}
                        className="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-blue-200 rounded-lg px-1 py-1.5 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                      >
                        {item.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm font-bold text-slate-700">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Assign Technician */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Assign Technician</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select 
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-slate-700 text-xs font-bold outline-none appearance-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                    >
                      <option>Dhananji</option>
                      <option>Lilantha Siriwardana</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <button 
                    onClick={handleAssign}
                    className="px-6 py-2.5 bg-blue-600 border border-blue-700 text-white text-xs font-black uppercase rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Comments</p>
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="group">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border ${comment.isTechnician ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}>
                          {comment.initials}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-700">{comment.user}</span>
                            <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded tracking-widest">{comment.role}</span>
                            <span className="text-[9px] text-slate-400 ml-auto">{comment.time}</span>
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="mt-2 space-y-2">
                              <textarea 
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full bg-white border border-blue-200 shadow-sm rounded-lg p-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 resize-none h-16"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleSaveEdit(comment.id)} className="text-[9px] font-black text-white hover:bg-blue-700 uppercase tracking-widest px-3 py-1 bg-blue-600 rounded-lg transition-all shadow-sm">Save</button>
                                <button onClick={() => setEditingCommentId(null)} className="text-[9px] font-black text-slate-500 hover:text-slate-700 uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-lg transition-all shadow-sm">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">{comment.message}</p>
                              {(comment.isTechnician || comment.isOwn) && (
                                <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEditComment(comment)} className="text-[9px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-lg transition-all">Edit</button>
                                  <button onClick={() => handleDeleteComment(comment.id)} className="text-[9px] font-black text-rose-500/80 hover:text-rose-600 uppercase tracking-widest px-3 py-1 bg-white border border-rose-100 shadow-sm rounded-lg transition-all">Delete</button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="pt-6 relative">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-white border border-blue-200 shadow-sm rounded-2xl p-4 pr-16 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none h-20"
                  ></textarea>
                  <button 
                    onClick={handleAddComment}
                    className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-95 shadow-sm group"
                  >
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveTicket}
                    className="px-6 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save changes
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
