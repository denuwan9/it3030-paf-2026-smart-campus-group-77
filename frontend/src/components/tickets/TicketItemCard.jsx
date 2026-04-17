import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import TicketBadge from './TicketBadge';

const TicketItemCard = ({ id, title, location, reporter, category, attachmentsCount, commentsCount, status, priority, onClick, onEdit, onDelete, theme = 'dark' }) => {
  const initials = reporter?.name?.split(' ').map(n => n[0]).join('') || 'UN';
  const isLight = theme === 'light';

  return (
    <div 
      onClick={onClick}
      className={`relative ${isLight ? 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md' : 'bg-[#171717] border border-white/5 hover:bg-[#1c1c1c]'} p-6 rounded-2xl shadow-sm transition-all group cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`${isLight ? 'text-slate-800 group-hover:text-blue-600' : 'text-white group-hover:text-amber-400/90'} text-lg font-bold transition-colors uppercase tracking-tight`}>{title}</h3>
          <p className="text-slate-500 text-sm mt-1">
            {id} · {location}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <TicketBadge type="status" value={status} />
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isLight ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50' : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'}`}
                title="Edit ticket"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isLight ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'}`}
                title="Delete ticket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <TicketBadge type="priority" value={priority} />
        </div>
      </div>

      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isLight ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-[#262626] text-slate-300 border-white/5'} border`}>
            {initials}
          </div>
          <span className="font-medium">{reporter?.name || 'Unassigned'}</span>
        </div>
        
        <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
        <span className="font-medium">{category}</span>
        
        <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
        <span className="font-medium">{attachmentsCount} attachments</span>
        
        <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
        <span className="font-medium">{commentsCount} comments</span>
      </div>
    </div>
  );
};

export default TicketItemCard;
