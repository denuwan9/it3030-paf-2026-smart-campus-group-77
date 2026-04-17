import React, { useState } from 'react';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  Search,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const roleHomePath = {
    ROLE_ADMIN: '/admin',
    ROLE_TECHNICIAN: '/technician',
    ROLE_USER: '/dashboard',
  };
  const overviewPath = roleHomePath[user?.role] || '/dashboard';

  const navigation = [
    { 
      label: 'Overview', 
      to: overviewPath,
      icon: LayoutDashboard, 
      roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
    { 
      label: 'Resources', 
      to: '/resources', 
      icon: Package, 
      roles: ['ROLE_USER'] 
    },
    {
      label: 'Bookings',
      to: user?.role === 'ROLE_ADMIN' ? '/admin/bookings' : '/bookings',
      icon: Calendar,
      roles: ['ROLE_USER', 'ROLE_ADMIN']
    },
    { 
      label: 'Incident Tickets', 
      to: '/tickets', 
      icon: Ticket, 
      roles: ['ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
    { 
      label: 'Command Center', 
      to: '/admin/users', 
      icon: ShieldCheck, 
      roles: ['ROLE_ADMIN'] 
    },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans selection:bg-blue-500/10">
      
      {/* Modular Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Top Navbar */}
        <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-10 flex-shrink-0 z-20">
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-slate-500 p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 md:gap-3 text-[10px] md:text-sm font-bold bg-slate-100 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-slate-200 shadow-inner">
              <span className="text-slate-500">Campus</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
              <span className="text-slate-800 capitalize tracking-tight truncate max-w-[100px] md:max-w-none">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group shadow-inner">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search modules..." 
                className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-32 xl:w-72 font-medium"
              />
            </div>
            
            <NotificationPanel />

            <div className="h-8 md:h-10 w-px bg-slate-200 mx-1 md:mx-2" />

            <Link to="/profile" className="flex items-center gap-2 sm:gap-4 pl-1 md:pl-2 group cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-xs md:text-sm font-black text-slate-800 leading-tight">{user?.fullName?.split(' ')[0]}</p>
                <p className="text-[9px] md:text-[10px] text-blue-600 font-extrabold uppercase tracking-widest mt-0.5">
                  {user?.role?.replace('ROLE_', '')}
                </p>
              </div>
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-[1.2rem] bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-blue-600 text-sm md:text-base shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5 group-hover:border-blue-500/30 overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0)
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 relative">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
