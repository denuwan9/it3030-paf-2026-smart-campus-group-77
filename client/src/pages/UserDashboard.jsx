import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Bell, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  AlertTriangle, 
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const UserDashboard = () => {

  const { user, session, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sync with backend on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync with backend on mount
  useEffect(() => {
    console.log("🔄 [Dashboard] Checking session sync. Stable logout:", !!logout);
    const syncUser = async () => {
      if (session?.access_token) {
        console.log("📡 [Dashboard] Attempting sync for:", session?.user?.email);
        try {
          const email = session?.user?.email?.toLowerCase();
          
          if (!email) {
            console.warn('⚠️ [Dashboard] User email not found in session.');
            return;
          }

          if (!email.endsWith('@sliit.lk') && !email.endsWith('@my.sliit.lk')) {
             throw new Error("Unauthorized domain");
          }

          const response = await fetch('http://localhost:8081/api/users/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });

          if (response.status === 403) {
            console.error('🛑 [Dashboard] Unauthorized domain detected by backend.');
            await logout();
            return;
          }
          
          if (!response.ok) throw new Error('Sync failed');
          console.log('User synced with backend successfully.');
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          if (error.message === "Unauthorized domain") {
            await logout();
          }
        }
      }
    };
    syncUser();
  }, [session?.access_token, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Syncing your campus profile...</p>
        </div>
      </div>
    );
  }

  const displayName = useMemo(() => {
    const full = user?.user_metadata?.full_name;
    if (full) return full.split(' ')[0];
    return user?.email?.split('@')[0] || 'Member';
  }, [user]);

  const stats = useMemo(() => [
    { label: 'Active Bookings', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Requests', value: '03', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Open Incidents', value: '01', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ], []);

  const activities = useMemo(() => [
    { id: 1, type: 'Booking', title: 'Study Room 4B', date: '2024-03-25', status: 'Approved', amount: '2 Hours' },
    { id: 2, type: 'Incident', title: 'A/C Leakage - Lab 2', date: '2024-03-24', status: 'Pending', amount: '-' },
    { id: 3, type: 'Booking', title: 'Projector - Hall A', date: '2024-03-23', status: 'Rejected', amount: '3 Hours' },
    { id: 4, type: 'Booking', title: 'Study Room 2C', date: '2024-03-22', status: 'Approved', amount: '1 Hour' },
    { id: 5, type: 'Incident', title: 'Wifi Slow - Library', date: '2024-03-21', status: 'Resolved', amount: '-' },
  ], []);

  const notifications = useMemo(() => [
    { id: 1, text: 'Booking Approved: Study Room 4B', time: '5m ago', type: 'success' },
    { id: 2, text: 'Technician assigned to your ticket #1024', time: '1h ago', type: 'info' },
    { id: 3, text: 'New resource available: 3D Printer Lab 5', time: '3h ago', type: 'update' },
  ], []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Resolved': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 
          flex flex-col z-30
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">SmartCampus</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 py-6">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={true} isOpen={isSidebarOpen} />
          <NavItem icon={BookOpen} label="Resources" isOpen={isSidebarOpen} />
          <NavItem icon={Calendar} label="My Bookings" isOpen={isSidebarOpen} />
          <NavItem icon={AlertTriangle} label="Report Incident" isOpen={isSidebarOpen} />
          <Link to="/profile">
            <NavItem icon={UserIcon} label="Profile" isOpen={isSidebarOpen} />
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 min-w-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search resources, bookings..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                    <span className="font-bold text-sm">Notifications</span>
                    <span className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium">Clear all</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                        <p className="text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-indigo-600">{n.text}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block font-medium">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-10 w-[1px] bg-gray-200 mx-2"></div>
            
            <Link to="/profile" className="flex items-center gap-3 pl-2 hover:bg-gray-50 p-2 rounded-2xl transition-colors group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{displayName}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-1 tracking-wider">Student Console</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                   {user?.user_metadata?.avatar_url ? (
                     <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon className="w-5 h-5 text-indigo-500" />
                   )}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Welcome Header */}
          <section className="bg-indigo-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                Good morning, {displayName}! 👋
              </h1>
              <p className="text-indigo-100 font-medium opacity-90">
                You have {stats[1].value} pending requests that need your attention today.
              </p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Recent Activity Table */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recent Activity
                </h2>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View all</button>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Ref Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activities.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-sm text-gray-900">{item.title}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-gray-500">{item.type}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-400">{item.date}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border leading-none ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100">
                             <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Action Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
                 <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
                 <p className="text-xs text-white/80 leading-relaxed mb-6">
                   Our technical team is available 24/7 to help you with resource bookings or incident reports.
                 </p>
                 <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl text-xs font-black shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-widest">
                   Get Support
                 </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-sm mb-4">Quick Shortcuts</h3>
                <div className="space-y-3">
                  <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group text-left">
                    <span className="text-xs font-bold text-gray-700">Reserve a Room</span>
                    <Plus className="w-4 h-4 text-indigo-500 group-hover:rotate-90 transition-transform" />
                  </button>
                  <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group text-left">
                    <span className="text-xs font-bold text-gray-700">Equipment Request</span>
                    <Plus className="w-4 h-4 text-indigo-500 group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, isOpen }) => (
  <button className={`
    w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
    ${active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
      : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}
  `}>
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
    {isOpen && <span className={`text-sm font-bold ${active ? 'font-black' : ''}`}>{label}</span>}
  </button>
);

const Plus = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default UserDashboard;
