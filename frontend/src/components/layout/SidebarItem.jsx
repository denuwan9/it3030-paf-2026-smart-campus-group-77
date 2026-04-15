import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
        active 
          ? 'bg-blue-600/10 text-blue-600 font-bold shadow-sm border border-blue-600/20' 
          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
      }`}
    >
      {/* Active Glowing Background */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-50" />
      )}
      
      {/* Icon Container */}
      <div className={`relative z-10 p-1.5 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
          : 'bg-slate-50 group-hover:bg-white transition-colors'
      }`}>
        <Icon className={`w-4.5 h-4.5 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      </div>
      
      {/* Label */}
      <span className="relative z-10 text-sm tracking-tight">{label}</span>
      
      {/* Active Indicator Line */}
      {active && (
        <motion.div 
          layoutId="sidebarActiveIndicator"
          className="absolute right-3 w-1.5 h-4 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)] filter drop-shadow-sm"
        />
      )}
    </Link>
  );
};

export default SidebarItem;
