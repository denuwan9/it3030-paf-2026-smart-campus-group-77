import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s?.toUpperCase()) {
      case 'OPEN':
      case 'AVAILABLE':
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'BOOKED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'APPROVED':
      case 'RESOLVED':
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'REJECTED':
      case 'CLOSED':
      case 'CANCELLED':
      case 'OUT_OF_SERVICE':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
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
