import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TicketStatCard from '../../components/tickets/TicketStatCard';
import TicketFilters from '../../components/tickets/TicketFilters';
import TicketItemCard from '../../components/tickets/TicketItemCard';
import NewTicketModal from '../../components/tickets/NewTicketModal';
import TicketDetailsSidebar from '../../components/tickets/TicketDetailsSidebar';
import toast from 'react-hot-toast';

const TicketsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets] = useState([
    {
      id: 'TKT-001',
      title: 'Projector not turning on',
      location: 'Lecture Hall 2A',
      reporter: { name: 'Ashan Perera' },
      category: 'Equipment',
      attachmentsCount: 2,
      commentsCount: 2,
      status: 'IN_PROGRESS',
      priority: 'HIGH'
    },
    {
      id: 'TKT-002',
      title: 'Water leak near server room door',
      location: 'Server Room, Block C',
      reporter: { name: 'Unassigned' },
      category: 'Plumbing',
      attachmentsCount: 3,
      commentsCount: 1,
      status: 'OPEN',
      priority: 'HIGH'
    },
    {
      id: 'TKT-003',
      title: 'Air conditioning noise — Lab 5',
      location: 'Computer Lab 5, Block B',
      reporter: { name: 'Unassigned' },
      category: 'Electrical',
      attachmentsCount: 0,
      commentsCount: 0,
      status: 'OPEN',
      priority: 'MEDIUM'
    },
    {
      id: 'TKT-004',
      title: 'Network port not working — Room 302',
      location: 'Room 302, Block A',
      reporter: { name: 'Nilufar Rashidova' },
      category: 'Network',
      attachmentsCount: 1,
      commentsCount: 1,
      status: 'RESOLVED',
      priority: 'LOW'
    },
    {
      id: 'TKT-005',
      title: 'Fire extinguisher mount broken',
      location: 'Corridor 1, Block D',
      reporter: { name: 'Dev Krishnamurthy' },
      category: 'Safety',
      attachmentsCount: 2,
      commentsCount: 2,
      status: 'CLOSED',
      priority: 'HIGH'
    }
  ]);

  const stats = [
    { label: 'Total tickets', value: 5 },
    { label: 'Open', value: 2, colorClass: 'text-blue-500' },
    { label: 'In progress', value: 1, colorClass: 'text-amber-500' },
    { label: 'Resolved', value: 1, colorClass: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] -m-8 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Filters */}
        <section>
          <TicketFilters 
            onSearch={() => {}} 
            onFilterStatus={() => {}} 
            onFilterPriority={() => {}} 
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
          <span className="text-white text-lg font-bold">5 tickets</span>
        </div>

        {/* Ticket List */}
        <section className="space-y-4">
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <TicketItemCard 
                {...ticket} 
                onClick={() => setSelectedTicket(ticket)}
              />
            </motion.div>
          ))}
        </section>
      </div>

      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          toast.success('Ticket submitted successfully (Demo)');
          setIsModalOpen(false);
        }}
      />

      <TicketDetailsSidebar 
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default TicketsPage;
