import React from 'react';

const TicketStatCard = ({ label, value, colorClass }) => {
  return (
    <div className="bg-[#171717] border border-white/5 p-6 rounded-2xl shadow-sm transition-all hover:bg-[#1c1c1c]">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-black ${colorClass || 'text-white'}`}>{value}</p>
    </div>
  );
};

export default TicketStatCard;
