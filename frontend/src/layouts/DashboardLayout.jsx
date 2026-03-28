import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
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

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-primary-600/10 text-primary-400 font-semibold shadow-sm' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-primary-400' : 'group-hover:text-slate-200'}`} />
    <span>{label}</span>
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
      />
    )}
  </Link>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { 
      label: 'Overview', 
      to: '/dashboard', 
      icon: LayoutDashboard, 
      roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
    { 
      label: 'Resources', 
      to: '/resources', 
      icon: Package, 
      roles: ['ROLE_USER', 'ROLE_ADMIN'] 
    },
    { 
      label: 'My Bookings', 
      to: '/bookings', 
      icon: Calendar, 
      roles: ['ROLE_USER'] 
    },
    { 
      label: 'Manage Bookings', 
      to: '/admin/bookings', 
      icon: Calendar, 
      roles: ['ROLE_ADMIN'] 
    },
    { 
      label: 'Incident Tickets', 
      to: '/tickets', 
      icon: Ticket, 
      roles: ['ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
    { 
      label: 'User Management', 
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
    <div className="min-h-screen bg-slate-950 flex font-sans">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-100">SmartCampus</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
            {filteredNav.map((item) => (
              <SidebarLink
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <SidebarLink 
              to="/profile" 
              icon={User} 
              label="My Profile" 
              active={location.pathname === '/profile'}
              onClick={() => setSidebarOpen(false)}
            />
            <SidebarLink 
              to="/settings" 
              icon={Settings} 
              label="Settings" 
              active={location.pathname === '/settings'}
              onClick={() => setSidebarOpen(false)}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 p-1">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center text-sm text-slate-400 border-l border-slate-700 ml-2 pl-4">
              <span className="hover:text-slate-200 cursor-pointer transition-colors">Campus</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-slate-100 font-medium capitalize">
                {location.pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-primary-500 transition-all">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-600 w-48 lg:w-64"
              />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900" />
            </button>

            <div className="h-8 w-px bg-slate-800 mx-1" />

            <div className="flex items-center gap-3 pl-2">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-100 leading-tight">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  {user?.role?.replace('ROLE_', '')}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {user?.fullName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
