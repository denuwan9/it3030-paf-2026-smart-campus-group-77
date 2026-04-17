import React from 'react';

const TicketBadge = ({ type, value }) => {
  const getStyles = () => {
    const v = value?.toUpperCase();
    
    if (type === 'status') {
      switch (v) {
        case 'OPEN':
          return 'bg-[#e0f2fe] text-[#0369a1]';
        case 'IN PROGRESS':
        case 'IN_PROGRESS':
          return 'bg-[#fef3c7] text-[#92400e]';
        case 'RESOLVED':
          return 'bg-[#dcfce7] text-[#166534]';
        case 'CLOSED':
          return 'bg-[#f1f5f9] text-[#475569]';
        default:
          return 'bg-slate-100 text-slate-700';
      }
    }

    if (type === 'priority') {
      switch (v) {
        case 'HIGH':
          return 'bg-[#fee2e2] text-[#991b1b]';
        case 'MEDIUM':
          return 'bg-[#fef3c7] text-[#92400e]';
        case 'LOW':
          return 'bg-[#f1f5f9] text-[#475569]';
        default:
          return 'bg-slate-100 text-slate-700';
      }
    }

    return 'bg-slate-100 text-slate-700';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${getStyles()}`}>
      {value?.replace('_', ' ')}
    </span>
  );
};

export default TicketBadge;
