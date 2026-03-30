import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, colorClass, trend }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm overflow-hidden relative group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${colorClass}`} />
    
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass.replace('bg-', 'bg-opacity-10 ')}`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    
    <div>
      <p className="text-xs sm:text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">{value}</h3>
    </div>
  </motion.div>
);

export default StatCard;
