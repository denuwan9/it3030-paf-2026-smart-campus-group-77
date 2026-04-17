import React from 'react';
import TicketBadge from './TicketBadge';

const TicketItemCard = ({ id, title, location, reporter, category, attachmentsCount, commentsCount, status, priority }) => {
  const initials = reporter?.name?.split(' ').map(n => n[0]).join('') || 'UN';

  return (
    <div className="bg-[#171717] border border-white/5 p-6 rounded-2xl shadow-sm transition-all hover:bg-[#1c1c1c] group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white text-lg font-bold group-hover:text-amber-400/90 transition-colors uppercase tracking-tight">{title}</h3>
          <p className="text-slate-500 text-sm mt-1">
            {id} · {location}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TicketBadge type="status" value={status} />
          <TicketBadge type="priority" value={priority} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[10px] font-bold text-slate-300 border border-white/5">
            {initials}
          </div>
          <span className="font-medium">{reporter?.name || 'Unassigned'}</span>
        </div>
        
        <span className="text-slate-600">·</span>
        <span className="font-medium">{category}</span>
        
        <span className="text-slate-600">·</span>
        <span className="font-medium">{attachmentsCount} attachments</span>
        
        <span className="text-slate-600">·</span>
        <span className="font-medium">{commentsCount} comments</span>
      </div>
    </div>
  );
};

export default TicketItemCard;
