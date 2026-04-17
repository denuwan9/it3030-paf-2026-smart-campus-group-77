import React from 'react';
import { Search, Plus } from 'lucide-react';

const TicketFilters = ({ onSearch, onFilterStatus, onFilterPriority, onNewTicket }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Search Input Mock - Looks like a button/div in the image */}
      <div className="w-12 h-12 bg-[#171717] border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1c1c1c] transition-all cursor-pointer">
        <Search className="w-5 h-5" />
      </div>

      {/* Filter Dropdowns */}
      <select 
        onChange={(e) => onFilterStatus(e.target.value)}
        className="bg-[#171717] border border-white/5 text-white text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none min-w-[140px]"
      >
        <option value="ALL">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      <select 
        onChange={(e) => onFilterPriority(e.target.value)}
        className="bg-[#171717] border border-white/5 text-white text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none min-w-[140px]"
      >
        <option value="ALL">All priorities</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      {/* New Ticket Button */}
      <button 
        onClick={onNewTicket}
        className="ml-auto flex items-center gap-2 bg-[#171717] border border-white/5 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1c1c1c] transition-all active:scale-95 shadow-sm"
      >
        <Plus className="w-4 h-4" />
        New ticket
      </button>
    </div>
  );
};

export default TicketFilters;
