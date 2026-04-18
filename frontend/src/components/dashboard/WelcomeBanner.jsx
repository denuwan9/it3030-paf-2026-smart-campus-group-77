import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WelcomeBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
      className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-nexer-brand-primary/95 to-emerald-600 p-6 sm:p-10 text-white shadow-nexer-lg border border-white/10 group"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] sm:text-xs font-black uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Nexer Smart Campus
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {getGreeting()}, <span className="text-emerald-100">{user?.fullName?.split(' ')[0]}!</span>
            </h1>
            <p className="text-emerald-50/80 text-xs sm:text-base font-medium max-w-lg leading-relaxed">
              Welcome back to your personalized operations hub. Your facility bookings and campus updates are optimized and ready for you today.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
            <button 
              onClick={() => navigate('/facilities')}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-nexer-brand-primary font-black text-xs sm:text-sm rounded-xl hover:bg-emerald-50 transition-all active:scale-95 shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 group/btn"
            >
              Explore Facilities
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/bookings')}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-xs sm:text-sm rounded-xl hover:bg-white/20 transition-all active:scale-95"
            >
              View Schedule
            </button>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 w-72 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60">Campus Pulse</p>
            <div className="space-y-3.5">
              {[
                { label: 'Active Bookings', value: '02', color: 'bg-white' },
                { label: 'System Status', value: 'Optimal', color: 'bg-emerald-300' },
                { label: 'Unread Alerts', value: '05', color: 'bg-emerald-100' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-white/90 whitespace-nowrap">{stat.label}</span>
                  <span className={`text-[10px] font-black min-w-[3rem] text-center px-2.5 py-1 rounded-lg text-emerald-900 shadow-sm ${stat.color}`}>
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
