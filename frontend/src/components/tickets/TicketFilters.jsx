import React from 'react';
import { Search, Plus } from 'lucide-react';

const TicketFilters = ({ onSearch, onFilterStatus, onFilterPriority, onNewTicket }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Search Input Mock */}
      <div className="w-12 h-12 bg-blue-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-blue-600 hover:bg-white hover:border-blue-400 transition-all cursor-pointer shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]">
        <Search className="w-5 h-5" />
      </div>

      {/* Filter Dropdowns */}
      <select 
        onChange={(e) => onFilterStatus(e.target.value)}
        className="bg-blue-50 border border-slate-200/60 text-blue-700 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none min-w-[140px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] cursor-pointer hover:bg-white hover:border-blue-400"
      >
        <option value="ALL">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      <select 
        onChange={(e) => onFilterPriority(e.target.value)}
        className="bg-blue-50 border border-slate-200/60 text-blue-700 text-sm font-semibold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none min-w-[140px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] cursor-pointer hover:bg-white hover:border-blue-400"
      >
        <option value="ALL">All priorities</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

    </div>
  );
};

export default TicketFilters;
