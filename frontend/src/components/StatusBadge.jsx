import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s?.toUpperCase()) {
      case 'OPEN':
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'BOOKED':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'RESOLVED':
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'REJECTED':
      case 'CLOSED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStyles(status)} tracking-wider uppercase`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
