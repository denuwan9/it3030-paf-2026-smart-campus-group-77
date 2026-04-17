import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, List, Upload, ChevronDown } from 'lucide-react';
import TicketItemCard from '../../components/tickets/TicketItemCard';
import TicketDetailsSidebar from '../../components/tickets/TicketDetailsSidebar';
import toast from 'react-hot-toast';

const UserTicketsPage = () => {
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

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('userTickets');
    if (saved) return JSON.parse(saved);
    return [
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
  ]});

  useEffect(() => {
    localStorage.setItem('userTickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleDeleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast.success('Ticket deleted successfully');
    if (selectedTicket?.id === id) {
      setSelectedTicket(null);
    }
  };

  const handleUpdateTicketProps = (id, updatedFields) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    if (selectedTicket?.id === id) {
      setSelectedTicket(prev => ({ ...prev, ...updatedFields }));
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] -m-8 bg-blue-50 text-slate-800 flex flex-col overflow-y-auto">
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* List Header */}
          <div className="flex flex-col gap-1 mb-6 mt-4">
            <h2 className="text-xl font-semibold text-slate-800">My Tickets</h2>
            <p className="text-sm text-slate-500">View and manage the status of your reported incidents.</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-slate-600 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full">{tickets.length} total tickets</span>
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
        onUpdateTicket={handleUpdateTicketProps}
      />
    </div>
  );
};

export default UserTicketsPage;
