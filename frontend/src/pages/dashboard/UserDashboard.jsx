import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Users, Heart } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const ResourceCard = ({ title, type, capacity, location, status, image }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm group"
  >
    <div className="relative h-48 bg-slate-800">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      <div className="absolute top-4 right-4 z-10">
        <StatusBadge status={status} />
      </div>
      <button className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors">
        <Heart className="w-4 h-4" />
      </button>
      {/* Fallback pattern if no image */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-24 h-24 border-4 border-primary-500 rounded-full animate-pulse" />
      </div>
    </div>
    
    <div className="p-5 space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{type}</span>
        </div>
        <h3 className="text-lg font-bold text-white mt-1 group-hover:text-primary-400 transition-colors">{title}</h3>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Users className="w-3.5 h-3.5" />
          <span>{capacity} Seats</span>
        </div>
      </div>
      
      <button className="w-full py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-all active:scale-95 flex items-center justify-center gap-2">
        <Calendar className="w-4 h-4" />
        Book Now
      </button>
    </div>
  </motion.div>
);

const UserDashboard = () => {
  const resources = [
    { title: 'Auditorium A', type: 'Venue', capacity: 500, location: 'Main Block', status: 'AVAILABLE' },
    { title: 'Project Lab 04', type: 'Lab', capacity: 40, location: 'Level 2', status: 'AVAILABLE' },
    { title: 'Seminar Room 02', type: 'Classroom', capacity: 60, location: 'New Wing', status: 'BOOKED' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Resource Catalogue</h1>
          <p className="text-slate-400 text-sm mt-1">Browse and book campus facilities instantly.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search facilities..." 
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/50 w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <ResourceCard {...item} />
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          My Recent Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Resource</th>
                <th className="text-left py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                <th className="text-left py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="text-right py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { name: 'Innovation Hub', time: 'Mar 28, 10:00 AM', status: 'PENDING' },
                { name: 'Sports Hall', time: 'Mar 24, 02:00 PM', status: 'COMPLETED' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 font-medium text-slate-200">{row.name}</td>
                  <td className="py-4 text-sm text-slate-400">{row.time}</td>
                  <td className="py-4"><StatusBadge status={row.status} /></td>
                  <td className="py-4 text-right">
                    <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
