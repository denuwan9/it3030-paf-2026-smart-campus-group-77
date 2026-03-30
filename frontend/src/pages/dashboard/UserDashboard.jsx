import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import ResourceCard from '../../components/dashboard/ResourceCard';

// Assets (imported correctly after copy)
import auditoriumImg from '../../assets/dashboard/auditorium.png';
import labImg from '../../assets/dashboard/lab.png';
import seminarImg from '../../assets/dashboard/seminar.png';

const UserDashboard = () => {
  const stats = [
    { label: 'Active Bookings', value: '12', icon: Calendar, colorClass: 'bg-emerald-500', trend: 12 },
    { label: 'Resource Access', value: '08', icon: CheckCircle2, colorClass: 'bg-blue-500', trend: -2 },
    { label: 'Incident Reports', value: '00', icon: ShieldAlert, colorClass: 'bg-amber-500', trend: 0 },
    { label: 'Upcoming Revs', value: '04', icon: Clock, colorClass: 'bg-rose-500', trend: 5 },
  ];

  const resources = [
    { 
      title: 'Grand Auditorium A', 
      type: 'Premier Venue', 
      capacity: 500, 
      location: 'Central Plaza', 
      status: 'AVAILABLE', 
      image: auditoriumImg 
    },
    { 
      title: 'Advanced AI Lab', 
      type: 'Tech Module', 
      capacity: 40, 
      location: 'Innovation Wing', 
      status: 'AVAILABLE', 
      image: labImg 
    },
    { 
      title: 'Global Seminar 02', 
      type: 'Smart Room', 
      capacity: 60, 
      location: 'South Block', 
      status: 'BOOKED', 
      image: seminarImg 
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Welcome Section */}
      <WelcomeBanner />

      {/* 2. Stats Quick-View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* 3. Resource Discovery Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-lumina-text-header tracking-tight">Resource Catalogue</h2>
            <p className="text-slate-500 text-sm font-medium">Browse and book premium campus facilities instantly.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find a module..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-lumina-brand-primary/5 focus:border-lumina-brand-primary transition-all shadow-lumina-sm"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-lumina-brand-primary transition-all shadow-lumina-sm hover:translate-y-[-1px]">
              <Filter className="w-5 h-5" />
            </button>
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button className="p-1.5 bg-white shadow-sm rounded-lg text-lumina-brand-primary">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, i) => (
            <ResourceCard key={i} {...resource} delay={0.2 + (i * 0.1)} />
          ))}
          
          {/* "Show All" Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="group relative rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center hover:border-lumina-brand-primary/30 hover:bg-lumina-brand-primary/5 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-lumina-brand-primary group-hover:text-white transition-all duration-500">
              <Sparkles className="w-6 h-6 text-lumina-brand-primary group-hover:text-white transition-all" />
            </div>
            <h3 className="font-black text-lumina-text-header group-hover:text-lumina-brand-primary transition-colors">View All Resources</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Explore over 40+ facilities</p>
            <ArrowRight className="w-5 h-5 mt-4 text-slate-300 group-hover:text-lumina-brand-primary group-hover:translate-x-1 transition-all" />
          </motion.div>
        </div>
      </section>

      {/* 4. Recent Activity Section */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-lumina-sm relative overflow-hidden">
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-lumina-text-header tracking-tight">Recent Activity</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">History & Status tracking</p>
          </div>
          <button className="text-sm font-black text-lumina-brand-primary hover:underline underline-offset-4 decoration-2">
            View Statement
          </button>
        </div>

        <div className="table-responsive">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Transaction / Resource</th>
                <th className="text-left pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Booking Date</th>
                <th className="text-left pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Status</th>
                <th className="text-right pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Innovation Lab Hub', type: 'Technology', time: 'Mar 30, 09:30 AM', status: 'PENDING' },
                { name: 'University Sports Complex', type: 'Facility', time: 'Mar 25, 02:00 PM', status: 'COMPLETED' },
                { name: 'Main Library Room 4', type: 'Study Space', time: 'Mar 22, 11:15 AM', status: 'COMPLETED' },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-lumina-bg-surface flex items-center justify-center font-black text-lumina-brand-primary text-xs border border-slate-100 group-hover:bg-white transition-all">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lumina-text-header text-sm">{row.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{row.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium">{row.time}</span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                      row.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                      {row.status}
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-lumina-brand-primary hover:text-white transition-all group-hover:shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
