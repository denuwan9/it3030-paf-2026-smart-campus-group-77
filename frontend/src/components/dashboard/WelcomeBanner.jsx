import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const WelcomeBanner = () => {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-lumina-brand-primary/95 to-emerald-600 p-8 sm:p-10 text-white shadow-lumina-lg border border-white/10 group"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Lumina Smart Campus
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {getGreeting()}, <span className="text-emerald-100">{user?.fullName?.split(' ')[0]}!</span>
            </h1>
            <p className="text-emerald-50/80 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
              Welcome back to your personalized operations hub. Your resource bookings and campus updates are optimized and ready for you today.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="px-6 py-2.5 bg-white text-lumina-brand-primary font-black text-sm rounded-xl hover:bg-emerald-50 transition-all active:scale-95 shadow-xl shadow-emerald-900/10 flex items-center gap-2 group/btn">
              Explore Resources
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
            <button className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-sm rounded-xl hover:bg-white/20 transition-all active:scale-95">
              View Schedule
            </button>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 w-64 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60">Campus Pulse</p>
            <div className="space-y-3">
              {[
                { label: 'Active Bookings', value: '02', color: 'bg-white' },
                { label: 'System Status', value: 'Optimal', color: 'bg-emerald-300' },
                { label: 'Unread Alerts', value: '05', color: 'bg-emerald-100' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/90">{stat.label}</span>
                  <span className={`text-xs font-black min-w-8 text-center py-0.5 rounded-lg text-emerald-900 ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
