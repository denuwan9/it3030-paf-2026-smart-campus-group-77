import React from 'react';
import { Layers } from 'lucide-react';

const EmptyState = ({ title, message, icon: Icon = Layers }) => (
  <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl">
    <div className="p-3 sm:p-4 bg-slate-800 rounded-full mb-4">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-slate-200 mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-slate-500 max-w-xs">{message}</p>
  </div>
);

export default EmptyState;
