import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ChevronDown } from 'lucide-react';

const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="bg-[#1f1f1f] w-full max-w-md rounded-2xl shadow-2xl border border-white/5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5">
            <h2 className="text-white text-lg font-bold tracking-tight">New incident ticket</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-[#2b2b2b] hover:bg-[#363636] flex items-center justify-center rounded-xl text-slate-400 transition-colors border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-5 pb-5 space-y-4">
            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Category</label>
                <div className="relative">
                  <select className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none transition-all">
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Network</option>
                    <option>Equipment</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Priority</label>
                <div className="relative">
                  <select className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none transition-all">
                    <option>Medium</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Resource / Location */}
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Resource / location</label>
              <input 
                 type="text" 
                 placeholder="e.g. Lab 3B, Building A"
                 className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Description</label>
              <textarea 
                 rows="3"
                 placeholder="Describe the issue..."
                 className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-600 resize-none"
              ></textarea>
            </div>

            {/* Contact details */}
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Contact details</label>
              <input 
                 type="text" 
                 placeholder="Phone or email"
                 className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-white/5 bg-[#181818] rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-500 group-hover:text-slate-400 transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Drop images here or <span className="text-[#10b981] font-bold hover:underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Up to 3 images</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-5 bg-[#181818]/50 border-t border-white/5 flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-white/5 transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <ChevronDown className="w-4 h-4" />
              </div>
              Cancel
            </button>
            <button 
              onClick={onSubmit}
              className="px-6 py-2.5 bg-[#2b2b2b] hover:bg-[#363636] border border-white/5 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
            >
              Submit ticket
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NewTicketModal;
