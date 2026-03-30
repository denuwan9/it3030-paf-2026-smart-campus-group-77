import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, colorClass, trend, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
    className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-lumina-sm overflow-hidden relative group transition-all"
  >
    {/* Subtle Glow Background */}
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-5 transition-opacity group-hover:opacity-10 ${colorClass}`} />
    
    <div className="flex items-center justify-between mb-6">
      <div className={`p-3.5 rounded-2xl ${colorClass.replace('bg-', 'bg-opacity-5 ')} border border-slate-50 shadow-sm transition-colors group-hover:shadow-md`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-tight ${trend > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    
    <div className="space-y-1">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-500 transition-colors uppercase">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-lumina-text-header tracking-tight group-hover:text-lumina-brand-primary transition-colors">{value}</h3>
        {/* Simplified subtext could go here */}
      </div>
    </div>
  </motion.div>
);

export default StatCard;
