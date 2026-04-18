import React from 'react';

const TicketStatCard = ({ label, value, colorClass }) => {
  return (
    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm transition-all hover:bg-blue-100/50">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-4xl font-black ${colorClass || 'text-slate-800'}`}>{value}</p>
    </div>
  );
};

export default TicketStatCard;
