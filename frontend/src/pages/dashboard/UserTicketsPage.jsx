import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, List, Bell, Upload, ChevronDown } from 'lucide-react';
import TicketItemCard from '../../components/tickets/TicketItemCard';
import TicketDetailsSidebar from '../../components/tickets/TicketDetailsSidebar';
import toast from 'react-hot-toast';

const UserTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Dummy user tickets
  const [tickets] = useState([
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

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Ticket submitted successfully');
    setActiveTab('list');
  };

  return (
    <div className="h-[calc(100vh-80px)] -m-8 bg-[#111111] text-white flex overflow-hidden">
      {/* Mini Sidebar */}
      <aside className="w-64 border-r border-[#222222] bg-[#1a1a1a] flex flex-col p-4 z-10">
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list' ? 'bg-[#2a2a2a] text-white' : 'text-slate-400 hover:bg-[#222] hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            My tickets
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'new' ? 'bg-[#2a2a2a] text-white' : 'text-slate-400 hover:bg-[#222] hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            New ticket
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'notifications' ? 'bg-[#2a2a2a] text-white' : 'text-slate-400 hover:bg-[#222] hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'new' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8">
                <h2 className="text-xl font-semibold mb-6">Report new incident</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Resource / location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lab A-201, Projector #"
                        className="w-full bg-[#222222] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Category</label>
                      <div className="relative">
                        <select className="w-full bg-[#222222] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none appearance-none transition-colors">
                          <option>Electrical</option>
                          <option>Plumbing</option>
                          <option>Network</option>
                          <option>Equipment</option>
                          <option>Safety</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of the issue"
                      className="w-full bg-[#222222] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Describe the problem in detail..."
                      className="w-full bg-[#222222] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none resize-none transition-colors"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Priority</label>
                      <div className="relative">
                        <select className="w-full bg-[#222222] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none appearance-none transition-colors">
                          <option>Medium</option>
                          <option>High</option>
                          <option>Low</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Preferred contact</label>
                      <input
                        type="text"
                        required
                        placeholder="Phone or email"
                        className="w-full bg-[#222222] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Attachments (max 3 images)</label>
                    <div className="border border-dashed border-[#444] hover:border-[#666] bg-[#222] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <p className="text-sm text-slate-400">Click to upload or drag images here</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-[#333] hover:bg-[#444] text-white text-sm font-medium rounded-lg transition-colors border border-[#555]">
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
                <h2 className="text-xl font-semibold">My Tickets</h2>
                <span className="text-sm text-slate-400 px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded-full">{tickets.length} total</span>
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
                      onClick={() => setSelectedTicket(ticket)}
                    />
                  </motion.div>
                ))}
                {tickets.length === 0 && (
                  <div className="text-center py-12 text-slate-500 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                    No tickets found.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-semibold mb-6">Notifications</h2>
              <div className="text-slate-500 text-center py-12 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                No new notifications.
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <TicketDetailsSidebar 
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default UserTicketsPage;
