import React from 'react';
import { Clock, CheckCircle2, AlertCircle, PlayCircle, XCircle } from 'lucide-react';

// --- TicketBadge Component ---
export const TicketBadge = ({ status }) => {
  const configs = {
    OPEN: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: AlertCircle },
    IN_PROGRESS: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: PlayCircle },
    RESOLVED: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
    CLOSED: { color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Clock },
    REJECTED: { color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle },
  };

  const config = configs[status] || configs.OPEN;
  const Icon = config.icon;

  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ')}
    </span>
  );
};

// --- TicketPriorityBadge Component ---
export const PriorityBadge = ({ priority }) => {
  const colors = {
    LOW: 'text-slate-400',
    MEDIUM: 'text-blue-500',
    HIGH: 'text-amber-500',
    URGENT: 'text-red-500 font-black',
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest ${colors[priority]}`}>
      {priority}
    </span>
  );
};
