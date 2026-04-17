import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, List, Upload, ChevronDown } from 'lucide-react';
import TicketItemCard from '../../components/tickets/TicketItemCard';
import TicketDetailsSidebar from '../../components/tickets/TicketDetailsSidebar';
import toast from 'react-hot-toast';

const UserTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditingSidebar, setIsEditingSidebar] = useState(false);

  useEffect(() => {
    // Simulate a technician adding/updating a ticket after a short delay
    const timer = setTimeout(() => {
      toast((t) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-800 text-sm">New Update</span>
          <span className="text-xs text-slate-500">A Technician has recently updated your ticket (TKT-001).</span>
        </div>
      ), { duration: 6000, icon: '🔔' });
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      title: 'Projector not turning on',
      location: 'Lecture Hall 2A',
      reporter: { name: 'My Self' },
      category: 'Equipment',
      attachmentsCount: 1,
      commentsCount: 2,
      status: 'IN_PROGRESS',
      priority: 'HIGH'
    },
    {
      id: 'TKT-004',
      title: 'Network port not working — Room 302',
      location: 'Room 302, Block A',
      reporter: { name: 'My Self' },
      category: 'Network',
      attachmentsCount: 0,
      commentsCount: 1,
      status: 'RESOLVED',
      priority: 'LOW'
    }
  ]);

  const [formData, setFormData] = useState({
    location: '', category: 'Electrical', title: '', description: '', priority: 'Medium', contact: ''
  });
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = 'Resource / location is required';
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.contact.trim()) newErrors.contact = 'Contact details are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const newTicket = {
      id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
      title: formData.title,
      location: formData.location,
      reporter: { name: 'My Self' },
      category: formData.category,
      attachmentsCount: attachments.length,
      commentsCount: 0,
      status: 'OPEN',
      priority: formData.priority.toUpperCase()
    };
    setTickets([newTicket, ...tickets]);
    toast.success('Ticket submitted successfully');
    setFormData({ location: '', category: 'Electrical', title: '', description: '', priority: 'Medium', contact: '' });
    setAttachments([]);
    setErrors({});
    setActiveTab('list');
  };

  const handleDeleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast.success('Ticket deleted successfully');
    if (selectedTicket?.id === id) {
      setSelectedTicket(null);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] -m-8 bg-blue-50 text-slate-800 flex flex-col overflow-y-auto">
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Top Right Horizontal Tabs */}
          <div className="flex justify-end mb-6">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'list' ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                My tickets
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'new' ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                New ticket
              </button>
            </div>
          </div>
          {activeTab === 'new' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-slate-800">Report new incident</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Resource / location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({...formData, location: e.target.value});
                          if(errors.location) setErrors({...errors, location: null});
                        }}
                        placeholder="e.g. Lab A-201, Projector #"
                        className={`w-full bg-slate-50 border ${errors.location ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none transition-colors`}
                      />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Category *</label>
                      <div className="relative">
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none transition-colors"
                        >
                          <option>Electrical</option>
                          <option>Plumbing</option>
                          <option>Network</option>
                          <option>Equipment</option>
                          <option>Safety</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({...formData, title: e.target.value});
                        if(errors.title) setErrors({...errors, title: null});
                      }}
                      placeholder="Brief summary of the issue"
                      className={`w-full bg-slate-50 border ${errors.title ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none transition-colors`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description *</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({...formData, description: e.target.value});
                        if(errors.description) setErrors({...errors, description: null});
                      }}
                      placeholder="Describe the problem in detail..."
                      className={`w-full bg-slate-50 border ${errors.description ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none resize-none transition-colors`}
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Priority *</label>
                      <div className="relative">
                        <select 
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none transition-colors"
                        >
                          <option>Medium</option>
                          <option>High</option>
                          <option>Low</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Preferred contact *</label>
                      <input
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => {
                          setFormData({...formData, contact: e.target.value});
                          if(errors.contact) setErrors({...errors, contact: null});
                        }}
                        placeholder="Phone or email"
                        className={`w-full bg-slate-50 border ${errors.contact ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none transition-colors`}
                      />
                      {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Attachments (max 3 images)</label>
                    <div className="border border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors relative focus-within:ring-2 focus-within:ring-blue-500">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                      <Upload className="w-6 h-6 text-slate-400 mb-2 pointer-events-none" />
                      <p className="text-sm text-slate-500 pointer-events-none">Click to upload or drag images here</p>
                    </div>
                    {attachments.length > 0 && (
                      <div className="flex gap-4 pt-2 overflow-x-auto">
                        {attachments.map((file, idx) => (
                          <div key={idx} className="relative w-20 h-20 flex-shrink-0 group rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeAttachment(idx)}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider">Remove</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                      Submit ticket
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'list' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">My Tickets</h2>
                <span className="text-sm text-slate-600 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full">{tickets.length} total</span>
              </div>
              <div className="space-y-4">
                {tickets.map((ticket, i) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <TicketItemCard 
                      {...ticket} 
                      theme="light"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setIsEditingSidebar(false);
                      }}
                      onEdit={() => {
                        setSelectedTicket(ticket);
                        setIsEditingSidebar(true);
                      }}
                      onDelete={handleDeleteTicket}
                    />
                  </motion.div>
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                    No tickets found.
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <TicketDetailsSidebar 
        isOpen={!!selectedTicket}
        onClose={() => {
          setSelectedTicket(null);
          setIsEditingSidebar(false);
        }}
        ticket={selectedTicket}
        isEditMode={isEditingSidebar}
        setIsEditMode={setIsEditingSidebar}
      />
    </div>
  );
};

export default UserTicketsPage;
