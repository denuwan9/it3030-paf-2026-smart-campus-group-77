import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight, Eye } from 'lucide-react';
import StatusBadge from '../StatusBadge';

const FacilityCard = ({ name, location, capacity, status, description, image, delay = 0, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
    className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-nexer-sm transition-all hover:shadow-nexer-lg group h-full flex flex-col"
  >
    {/* Image Section */}
    <div className="relative h-48 sm:h-52 overflow-hidden">
      <img 
        src={image || '/placeholder-facility.png'} 
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <StatusBadge status={status} />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
          <Users className="w-3 h-3 text-white" />
          {capacity}
        </div>
      </div>
      
      {/* Decorative Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    
    {/* Content Section */}
    <div className="p-6 flex-1 flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-black text-nexer-text-header group-hover:text-nexer-brand-primary transition-colors tracking-tight line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-2 text-slate-400 mt-1.5 font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-wider">{location}</span>
        </div>
      </div>
      
      <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
        {description || 'Explore our state-of-the-art campus facility designed for excellence and collaboration.'}
      </p>
      
      <div className="mt-auto">
        <button 
          onClick={onClick}
          className="w-full py-3 bg-slate-50 border border-slate-100 hover:bg-nexer-brand-primary hover:text-white hover:border-transparent text-slate-500 font-black text-xs rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
        >
          <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          View Facility Details
        </button>
      </div>
    </div>
  </motion.div>
);

export default FacilityCard;
