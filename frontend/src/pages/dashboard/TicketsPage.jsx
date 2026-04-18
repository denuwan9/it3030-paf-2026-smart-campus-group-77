import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TicketStatCard from '../../components/tickets/TicketStatCard';
import TicketFilters from '../../components/tickets/TicketFilters';
import TicketItemCard from '../../components/tickets/TicketItemCard';
import NewTicketModal from '../../components/tickets/NewTicketModal';
import TicketDetailsSidebar from '../../components/tickets/TicketDetailsSidebar';
import toast from 'react-hot-toast';
import ticketService from '../../services/ticketService';
import { Loader2 } from 'lucide-react';

const TicketsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditingSidebar, setIsEditingSidebar] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketService.getAllTickets();
      setTickets(res.data);
    } catch (err) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const stats = [
    { label: 'Total tickets', value: tickets.length },
    { label: 'Open', value: tickets.filter(t => t.status === 'OPEN').length, colorClass: 'text-blue-500' },
    { label: 'In progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, colorClass: 'text-amber-500' },
    { label: 'Resolved/Closed', value: tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length, colorClass: 'text-emerald-500' },
  ];

  const filteredTickets = tickets.filter(ticket => {
    return (statusFilter === 'ALL' || ticket.status === statusFilter) &&
           (priorityFilter === 'ALL' || ticket.priority === priorityFilter);
  });

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
    <div className="min-h-screen bg-blue-50 -m-8 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Filters */}
        <section>
          <TicketFilters 
            onSearch={() => {}} 
            onFilterStatus={setStatusFilter} 
            onFilterPriority={setPriorityFilter} 
            onNewTicket={() => setIsModalOpen(true)} 
          />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <TicketStatCard {...stat} />
            </motion.div>
          ))}
        </section>

        {/* List Header */}
        <div className="flex items-center gap-2 pt-4">
          <span className="text-slate-800 text-lg font-bold">{filteredTickets.length} tickets</span>
        </div>

        {/* Ticket List */}
        <section className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-blue-200">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-blue-900/60 font-bold uppercase tracking-widest text-xs">Synchronizing with server...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-blue-200">
               <p className="text-blue-900/60 font-black uppercase tracking-widest">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <TicketItemCard 
                  {...ticket} 
                  id={ticket.id.toString().substring(0, 8).toUpperCase()}
                  reporter={{ name: ticket.reporterName }}
                  theme="light"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setIsEditingSidebar(true);
                  }}
                  onEdit={() => {
                    setSelectedTicket(ticket);
                    setIsEditingSidebar(true);
                  }}
                  onDelete={handleDeleteTicket}
                />
              </motion.div>
            ))
          )}
        </section>
      </div>

      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (newTicketData) => {
          try {
            await ticketService.createTicket({
              ...newTicketData,
              priority: newTicketData.priority.toUpperCase()
            });
            toast.success('Ticket submitted to server');
            fetchTickets();
            setIsModalOpen(false);
          } catch (err) {
            toast.error('Failed to submit ticket');
          }
        }}
      />

      <TicketDetailsSidebar 
        isOpen={!!selectedTicket}
        onClose={() => {
          setSelectedTicket(null);
          setIsEditingSidebar(false);
        }}
        ticket={selectedTicket}
        isEditMode={isEditingSidebar}
        setIsEditMode={setIsEditingSidebar}
        onUpdateTicket={async (id, updatedFields) => {
          if (updatedFields.status) {
            try {
              await ticketService.updateTicketStatus(selectedTicket.id, updatedFields.status);
              toast.success('Status updated on server');
              fetchTickets();
            } catch (err) {
              toast.error('Failed to update status');
            }
          }
        }}
      />
    </div>
  );
};

export default TicketsPage;
