import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, colorClass, trend, description, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    whileHover={{ y: -8 }}
    className="relative group h-full"
  >
    {/* Glassmorphism Container */}
    <div className="h-full bg-white border border-slate-100 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden relative">
      
      {/* Dynamic Animated Background Gradient */}
      <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 ${colorClass}`} />
      
      <div className="flex items-start justify-between relative z-10 mb-8">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-110`}>
          {/* Icon Backdrop */}
          <div className={`absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity ${colorClass}`} />
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 relative z-10 ${colorClass.replace('bg-', 'text-')}`} />
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${trend > 0 ? 'animate-pulse' : ''}`} />
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className="text-4xl sm:text-5xl font-black text-nexer-text-header tracking-tighter group-hover:text-nexer-brand-primary transition-colors duration-300">
          {value}
        </h3>
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-500 transition-colors">
            {label}
          </p>
          {description && (
            <p className="text-[11px] font-medium text-slate-400 line-clamp-1 italic">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
         <Icon className={`w-12 h-12 rotate-[-15deg] ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
