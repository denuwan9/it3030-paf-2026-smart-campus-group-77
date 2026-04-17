import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, colorClass, trend }) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white border border-slate-200 p-6 rounded-2xl shadow-nexer-md hover:shadow-nexer-lg overflow-hidden relative group transition-all duration-300"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`} />
    
    <div className="flex items-center justify-between mb-5">
      <div className={`p-3 rounded-2xl ${colorClass.replace('bg-', 'bg-opacity-10 ')}`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    
    <div className="relative z-10">
      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-nexer-text-header mt-1 tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

export default StatCard;
