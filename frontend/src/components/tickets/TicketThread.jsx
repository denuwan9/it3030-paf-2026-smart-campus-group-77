import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Trash2, Loader2, User as UserIcon } from 'lucide-react';
import ticketService from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const TicketThread = ({ ticketId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await ticketService.getComments(ticketId);
      setComments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await ticketService.addComment(ticketId, newComment);
      setNewComment('');
      fetchComments();
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ticketService.deleteComment(id);
      fetchComments();
      toast.success('Comment removed');
    } catch (err) {
      toast.error('Could not delete comment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-nexer-brand-primary" />
        <h3 className="text-lg font-black text-nexer-text-header">Discussion Thread</h3>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No comments yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`flex gap-4 ${comment.authorId === user?.userId ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0">
                {comment.profileImageUrl ? (
                  <img src={comment.profileImageUrl} className="w-8 h-8 rounded-lg object-cover border border-white shadow-sm" alt="Author" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 font-black text-[10px]">
                    {comment.authorName?.[0]}
                  </div>
                )}
              </div>
              <div className={`max-w-[80%] space-y-1 ${comment.authorId === user?.userId ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5 px-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{comment.authorName}</span>
                  <span className="text-[10px] font-bold text-slate-300">
                    {formatDistanceToNow(parseISO(comment.createdAt))} ago
                  </span>
                </div>
                <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm relative group ${
                  comment.authorId === user?.userId 
                    ? 'bg-nexer-brand-primary text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-nexer-text-header rounded-tl-none'
                }`}>
                  {comment.content}
                  
                  {comment.authorId === user?.userId && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-nexer-brand-primary/5 focus:border-nexer-brand-primary transition-all outline-none resize-none pr-16"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="absolute right-3 bottom-3 p-3 bg-nexer-brand-primary text-white rounded-xl shadow-lg shadow-nexer-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};

export default TicketThread;
