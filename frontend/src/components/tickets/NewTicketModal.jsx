import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '', location: '', category: 'Maintenance', description: '', priority: 'Medium', contact: ''
  });
  const [attachments, setAttachments] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > 3) {
      toast.error('You can only upload a maximum of 3 images');
      const allowedFiles = files.slice(0, 3 - attachments.length);
      setAttachments([...attachments, ...allowedFiles]);
      return;
    }
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleContactChange = (e) => {
    let value = e.target.value;
    
    // Prevent any capital letters
    value = value.toLowerCase();

    // Check if it's potentially a phone number (all digits)
    const isDigitsOnly = /^\d*$/.test(value);

    if (isDigitsOnly) {
      if (value.length <= 10) {
        setFormData(prev => ({ ...prev, contact: value }));
      }
      return;
    }

    // If it's not just digits, it's an email/ID
    // Filter to allow ONLY lowercase letters, numbers, @, and dots
    const filteredValue = value.replace(/[^a-z0-9@.]/g, '');
    setFormData(prev => ({ ...prev, contact: filteredValue }));
  };

  const handleSubmit = async () => {
    const contact = formData.contact.trim();

    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim() || !contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validation Logic
    const isDigitsOnly = /^\d+$/.test(contact);

    if (isDigitsOnly) {
      if (contact.length !== 10) {
        toast.error('Phone number must be exactly 10 digits');
        return;
      }
    } else {
      // Must contain @ for email-like entries
      if (!contact.includes('@')) {
        toast.error('Email contact must contain @');
        return;
      }
    }

    // Convert attachments to base64 for persistence in mockup
    const imagePromises = attachments.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const images = await Promise.all(imagePromises);

    onSubmit({ 
      ...formData, 
      attachmentsCount: attachments.length,
      images: images // Add the base64 images to the ticket object
    });
    
    setFormData({ title: '', location: '', category: 'Maintenance', description: '', priority: 'Medium', contact: '' });
    setAttachments([]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-blue-50 bg-white shrink-0">
            <h2 className="text-slate-800 text-lg font-bold tracking-tight">New incident ticket</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 flex items-center justify-center rounded-xl text-slate-500 transition-colors border border-slate-200 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-5 pt-4 pb-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all shadow-sm"
                   >
                    <option>Maintenance</option>
                    <option>IT support</option>
                    <option>IT equipment</option>
                    <option>Other</option>
                    <option>Facility</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Network</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1">Priority</label>
                <div className="relative">
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all shadow-sm"
                   >
                    <option>Medium</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1">Title</label>
              <input 
                 type="text" 
                 value={formData.title}
                 onChange={e => setFormData({...formData, title: e.target.value})}
                 placeholder="Brief summary of the issue"
                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Resource / Location */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1">Resource / location</label>
              <input 
                 type="text" 
                 value={formData.location}
                 onChange={e => setFormData({...formData, location: e.target.value})}
                 placeholder="e.g. Lab 3B, Building A"
                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1">Description</label>
              <textarea 
                 rows="3"
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
                 placeholder="Describe the issue..."
                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 resize-none shadow-sm"
              ></textarea>
            </div>

            {/* Contact details */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1">Contact details</label>
              <input 
                 type="text" 
                 value={formData.contact}
                 onChange={handleContactChange}
                 placeholder="Phone or email"
                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Image Upload Area */}
            <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-colors group overflow-hidden">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 border border-slate-200 group-hover:text-blue-500 transition-colors shadow-sm pointer-events-none">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center pointer-events-none">
                <p className="text-sm text-slate-500">
                  Drop images here or <span className="text-blue-600 font-bold hover:underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Up to 3 images</p>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pt-2 pb-1">
                {attachments.map((file, idx) => (
                  <div key={idx} className="relative w-16 h-16 flex-shrink-0 group rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider">DEL</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-95 border border-transparent shadow-sm hover:border-slate-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
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
