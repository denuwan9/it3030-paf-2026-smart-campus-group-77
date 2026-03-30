import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, Heart, Share2, Sparkles } from 'lucide-react';
import StatusBadge from '../StatusBadge';

const ResourceCard = ({ title, type, capacity, location, status, image, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
    className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-lumina-sm transition-all hover:shadow-lumina-md group h-full flex flex-col"
  >
    {/* Image Section */}
    <div className="relative h-56 overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
      
      {/* Badges & Actions */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-emerald-300" />
          {type}
        </div>
        <div className="flex flex-col gap-2">
          <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white/70 hover:bg-white/90 hover:text-rose-500 transition-all border border-white/20 active:scale-95">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white/70 hover:bg-white/90 hover:text-lumina-brand-primary transition-all border border-white/20 active:scale-95">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <StatusBadge status={status} />
      </div>
    </div>
    
    {/* Content Section */}
    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
      <div className="space-y-3">
        <h3 className="text-xl font-black text-lumina-text-header group-hover:text-lumina-brand-primary transition-colors tracking-tight line-clamp-1">
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-lumina-brand-primary transition-colors">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            {location}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
              <Users className="w-3.5 h-3.5" />
            </div>
            {capacity} People
          </div>
        </div>
      </div>
      
      <button className="w-full py-3.5 bg-lumina-bg-surface hover:bg-lumina-brand-primary text-lumina-brand-primary hover:text-white font-black text-sm rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-lumina-brand-primary/10 hover:border-transparent group-hover:shadow-lumina-sm">
        <Calendar className="w-4.5 h-4.5" />
        Schedule Booking
      </button>
    </div>
  </motion.div>
);

export default ResourceCard;
