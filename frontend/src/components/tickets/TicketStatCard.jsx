import React from 'react';

const TicketStatCard = ({ label, value, colorClass, icon: Icon, trend }) => {
  return (
    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all hover:shadow-md group relative overflow-hidden">
      {/* Accent Line */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${colorClass.replace('text-', 'bg-')}`} />
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
          <p className={`text-3xl font-black ${colorClass}`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">+{trend}%</span>
              <span className="text-[9px] text-slate-400 font-medium italic">from last week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50').replace('500', '50').replace('400', '50')} ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketStatCard;
