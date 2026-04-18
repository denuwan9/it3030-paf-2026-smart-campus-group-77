import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Loader2
} from 'lucide-react';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import ResourceCard from '../../components/dashboard/ResourceCard';
import dashboardService from '../../services/dashboardService';
import resourceService from '../../services/resourceService';
import facilityService from '../../services/facilityService';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import FacilityCard from '../../components/dashboard/FacilityCard';

// Assets (imported correctly after copy)
import auditoriumImg from '../../assets/dashboard/auditorium.png';
import labImg from '../../assets/dashboard/lab.png';
import seminarImg from '../../assets/dashboard/seminar.png';

const UserDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes, resourcesRes, facilitiesRes] = await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getRecentActivity(),
          resourceService.getAllResources(),
          facilityService.getAllFacilities()
        ]);
        setStatsData(statsRes.data);
        setActivityData(activityRes.data);
        // Limit to top 3 for dashboard overview
        setResourcesData((resourcesRes.data || []).slice(0, 3));
        // Show 4 random facilities for a dynamic dashboard experience
        const shuffled = (facilitiesRes.data || []).sort(() => 0.5 - Math.random());
        setFacilitiesData(shuffled.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Bookings', value: statsData?.activeBookings || '0', icon: Calendar, colorClass: 'bg-emerald-500', trend: 0 },
    { label: 'Resource Access', value: statsData?.totalResources || '0', icon: CheckCircle2, colorClass: 'bg-blue-500', trend: 0 },
    { label: 'Incident Reports', value: statsData?.pendingTickets || '0', icon: ShieldAlert, colorClass: 'bg-amber-500', trend: 0 },
    { label: 'Notifications', value: statsData?.notificationsCount || '0', icon: Clock, colorClass: 'bg-rose-500', trend: 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-nexer-brand-primary" />
      </div>
    );
  }

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

      {/* 3. Facilities Discovery Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-nexer-text-header tracking-tight">Campus Facilities</h2>
            <p className="text-slate-500 text-sm font-medium">Browse and book premium campus facilities instantly.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find a facility..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-nexer-brand-primary/5 focus:border-nexer-brand-primary transition-all shadow-nexer-sm"
              />
            </div>
            <button 
              onClick={() => navigate('/facilities')}
              className="px-6 py-2.5 bg-nexer-brand-primary text-white text-sm font-black rounded-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-nexer-md shadow-nexer-brand-primary/20 flex items-center gap-2"
            >
              See More <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilitiesData
            .filter(f => 
              f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
              f.location?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((facility, i) => (
            <FacilityCard 
              key={facility.id} 
              {...facility}
              image={facility.imageUrl || (i % 3 === 0 ? auditoriumImg : i % 3 === 1 ? labImg : seminarImg)}
              delay={0.2 + (i * 0.1)} 
              onClick={() => navigate(`/facilities?id=${facility.id}`)}
            />
          ))}
          
          {facilitiesData.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
               <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No facilities found in system</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Recent Activity Section */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-nexer-sm relative overflow-hidden">
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-nexer-text-header tracking-tight">Recent Activity</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">History & Status tracking</p>
          </div>
          <button 
            onClick={() => navigate('/bookings')}
            className="text-xs sm:text-sm font-black text-nexer-brand-primary hover:underline underline-offset-4 decoration-2 text-left"
          >
            View Statement
          </button>
        </div>

        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Transaction / Resource</th>
                <th className="text-left pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Booking Date</th>
                <th className="text-left pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Status</th>
                <th className="text-right pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activityData.map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-nexer-bg-surface flex items-center justify-center font-black text-nexer-brand-primary text-xs border border-slate-100 group-hover:bg-white transition-all">
                        {row.title?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-nexer-text-header text-sm truncate">{row.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase truncate">{row.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 pr-4 px-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium whitespace-nowrap">
                        {row.timestamp ? formatDistanceToNow(new Date(row.timestamp), { addSuffix: true }) : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pr-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border whitespace-nowrap ${
                      row.status === 'APPROVED' || row.status === 'COMPLETED' || row.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'APPROVED' || row.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                      {row.status}
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <button 
                      onClick={() => navigate('/bookings')}
                      className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-nexer-brand-primary hover:text-white transition-all group-hover:shadow-sm ml-auto"
                    >
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
