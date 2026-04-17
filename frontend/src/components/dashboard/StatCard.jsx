import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, colorClass, trend, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="bg-white border border-slate-100 p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] shadow-nexer-md hover:shadow-nexer-lg overflow-hidden relative group transition-all duration-300"
  >
    {/* Subtle Glow Background */}
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`} />
    
    <div className="flex items-center justify-between mb-5 sm:mb-8">
      <div className={`p-3 sm:p-4 rounded-[1.2rem] sm:rounded-2xl ${colorClass.replace('bg-', 'bg-opacity-10 ')} border border-slate-50 shadow-sm transition-all group-hover:shadow-md`}>
        <Icon className={`w-5 h-5 sm:w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${trend > 0 ? 'animate-pulse' : ''}`} />
          {trend > 0 ? 'UP' : 'DOWN'} {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-500 transition-colors leading-none">{label}</p>
      <div className="flex items-baseline gap-2 pt-1">
        <h3 className="text-2xl sm:text-4xl font-black text-nexer-text-header tracking-tight group-hover:text-nexer-brand-primary transition-colors">{value}</h3>
      </div>
    </div>
  </motion.div>
);

export default StatCard;
