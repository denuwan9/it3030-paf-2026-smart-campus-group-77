import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight,
  Package,
  Calendar,
  Ticket,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
      active 
        ? 'bg-nexer-brand-primary text-white font-bold shadow-nexer-md' 
        : 'text-nexer-text-body hover:bg-nexer-brand-primary/5 hover:text-nexer-brand-primary'
    }`}
  >
    <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-white/20' : 'bg-nexer-bg-surface group-hover:bg-nexer-brand-primary/10'}`}>
      <Icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-nexer-brand-primary'}`} />
    </div>
    <span className="text-sm tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeTabIndicator"
        className="ml-auto w-1.5 h-4 rounded-full bg-white/40"
      />
    )}
  </Link>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-nexer-bg-base flex font-sans selection:bg-nexer-brand-primary/10">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-nexer-sm border border-slate-100 group-hover:shadow-nexer-md transition-all group-hover:scale-105 active:scale-95 overflow-hidden p-1.5">
                <img src={logo} alt="SLIIT Nexer Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-nexer-text-header leading-none group-hover:text-nexer-brand-primary transition-colors">Nexer</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Campus</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 p-1 hover:bg-slate-50 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-6 py-4 space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Menu</p>

            {filteredNav.map((item) => (
              <SidebarLink
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="p-6 border-t border-slate-50 space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Identity</p>
            <SidebarLink 
              to="/profile" 
              icon={User} 
              label="My Profile" 
              active={location.pathname === '/profile'}
              onClick={() => setSidebarOpen(false)}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-nexer-status-error font-bold hover:bg-nexer-status-error/5 transition-all mt-2 group"
            >
              <div className="p-1.5 bg-nexer-status-error/10 rounded-lg group-hover:bg-nexer-status-error/20 transition-colors">
                <LogOut className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm">Disconnect</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-3 text-sm font-bold bg-nexer-bg-surface px-4 py-2 rounded-2xl border border-slate-100">
              <span className="text-slate-400">Campus</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="text-nexer-text-header capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 bg-nexer-bg-surface border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-nexer-brand-primary focus-within:ring-4 focus-within:ring-nexer-brand-primary/5 transition-all group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-nexer-brand-primary" />
              <input 
                type="text" 
                placeholder="Search modules..." 
                className="bg-transparent border-none outline-none text-sm text-nexer-text-body placeholder:text-slate-400 w-48 xl:w-72 font-medium"
              />
            </div>
            
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-nexer-brand-primary rounded-2xl transition-all border border-transparent hover:border-slate-100">
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-nexer-status-error rounded-full border-2 border-white" />
            </button>

            <div className="h-10 w-px bg-slate-100 mx-2" />

            <Link to="/profile" className="flex items-center gap-4 pl-2 group cursor-pointer">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-black text-nexer-text-header leading-tight">{user?.fullName}</p>
                <p className="text-[10px] text-nexer-brand-primary font-black uppercase tracking-widest mt-0.5">
                  {user?.role?.replace('ROLE_', '')}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[1.2rem] bg-nexer-bg-surface border border-slate-200 flex items-center justify-center font-black text-nexer-brand-primary text-base shadow-nexer-sm group-hover:shadow-nexer-md transition-all group-hover:translate-y-[-1px] group-hover:border-nexer-brand-primary/20 overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0)
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-nexer-bg-surface/50 p-4 sm:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
