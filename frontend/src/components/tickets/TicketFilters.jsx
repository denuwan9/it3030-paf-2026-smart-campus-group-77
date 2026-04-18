import React from 'react';
import { Search, Plus } from 'lucide-react';

const TicketFilters = ({ onSearch, onFilterStatus, onFilterPriority, onNewTicket }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Search Input Mock */}
      <div className="w-12 h-12 bg-blue-500 border border-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-all cursor-pointer shadow-md">
        <Search className="w-5 h-5" />
      </div>

      {/* Filter Dropdowns */}
      <select 
        onChange={(e) => onFilterStatus(e.target.value)}
        className="bg-blue-500 border border-blue-600 text-white text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 transition-all appearance-none min-w-[140px] shadow-md cursor-pointer hover:bg-blue-600"
      >
        <option value="ALL">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      <select 
        onChange={(e) => onFilterPriority(e.target.value)}
        className="bg-blue-500 border border-blue-600 text-white text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 transition-all appearance-none min-w-[140px] shadow-md cursor-pointer hover:bg-blue-600"
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
