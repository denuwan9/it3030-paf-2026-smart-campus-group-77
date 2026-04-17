import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SidebarItem from './SidebarItem';
import logo from '../../assets/logo.png';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  Ticket, 
  ShieldCheck, 
  Building2,
  User, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { 
      label: 'Overview', 
      to: '/dashboard', 
      icon: LayoutDashboard, 
      roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
    { 
      label: 'User Management', 
      to: '/admin/users', 
      icon: ShieldCheck, 
      roles: ['ROLE_ADMIN'] 
    },
    { 
      label: 'Facilities', 
      to: '/facilities', 
      icon: Building2, 
      roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
    { 
      label: 'Manage Facilities', 
      to: '/admin/facilities', 
      icon: Package, 
      roles: ['ROLE_ADMIN'] 
    },
    { 
      label: 'Resources', 
      to: '/resources', 
      icon: Package, 
      roles: ['ROLE_USER', 'ROLE_ADMIN'] 
    },
    { 
      label: 'Incident Tickets', 
      to: '/tickets', 
      icon: Ticket, 
      roles: ['ROLE_ADMIN', 'ROLE_TECHNICIAN'] 
    },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 h-screen flex flex-col
        transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        
        /* White Glassmorphism Styling */
        bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-nexer-md lg:shadow-none
      `}>
        {/* Header section (Logo) - Fixed height inside flex column */}
        <div className="flex-none p-6 flex items-center justify-between border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-slate-100 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 group-hover:bg-white transition-all group-hover:scale-105 active:scale-95 overflow-hidden p-1.5">
              <img src={logo} alt="SLIIT Nexer Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">Nexer</span>
              <span className="text-[10px] font-bold text-blue-600/80 uppercase tracking-widest mt-1">Smart Campus</span>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Core Modules</p>

          {filteredNav.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
              active={location.pathname === item.to}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        {/* Footer section (Fixed at bottom) */}
        <div className="flex-none p-5 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Identity & Security</p>
          <SidebarItem 
            to="/profile" 
            icon={User} 
            label="My Profile" 
            active={location.pathname === '/profile'}
            onClick={() => setIsOpen(false)}
          />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:text-rose-700 font-bold hover:bg-rose-50/10 transition-all mt-2 group border border-transparent hover:border-rose-500/20 relative overflow-hidden"
          >
            <div className="relative z-10 p-1.5 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors shadow-sm">
              <LogOut className="w-4.5 h-4.5" />
            </div>
            <span className="relative z-10 text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
