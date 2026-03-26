import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  ShieldAlert, 
  Trash2, 
  UserPlus, 
  Search,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  MoreVertical,
  Mail,
  ShieldCheck,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUserManagementPage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const loadUsers = useCallback(async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res?.data || []);
    } catch (err) {
      console.error('❌ [Admin] Failed to load users:', err);
      setMessage({ type: 'error', text: 'Failed to fetch user directory.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUpdateRole = useCallback(async (id, currentRole) => {
    const newRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      await adminService.updateUserRole(id, newRole);
      setMessage({ type: 'success', text: `Role updated for user ${id.substring(0, 8)}...` });
      loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update user role.' });
    }
  }, [loadUsers]);

  const handleDeleteUser = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await adminService.deleteUser(id);
        setMessage({ type: 'success', text: 'User removed from system.' });
        loadUsers();
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to delete user.' });
      }
    }
  }, [loadUsers]);

  const filteredUsers = useMemo(() => users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [users, searchTerm]);

  const stats = useMemo(() => [
    { label: 'Total Members', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Administrators', value: users.filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ADMIN').length, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Verified Accounts', value: users.filter(u => u.isActive !== false).length, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
  ], [users]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Accessing Admin Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-gray-900">
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
             <ShieldAlert className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">AdminPanel</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 py-6">
          <Link to="/admin-dashboard">
            <NavItem icon={LayoutDashboard} label="Dashboard" active={true} isOpen={isSidebarOpen} />
          </Link>
          <NavItem icon={Users} label="User Directory" isOpen={isSidebarOpen} />
          <Link to="/profile">
            <NavItem icon={ShieldCheck} label="My Profile" isOpen={isSidebarOpen} />
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 min-w-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-900 leading-none capitalize">{user?.user_metadata?.full_name || 'Admin User'}</p>
                <p className="text-[10px] text-red-600 font-black uppercase mt-1 tracking-widest">Master Admin</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-indigo-600" />
                )}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome & Message */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">User Management</h1>
              <p className="text-gray-500 font-medium">Monitor and manage access for all campus members.</p>
            </div>
            
            {message && (
              <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in slide-in-from-right-10 duration-500 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {message.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                {message.text}
                <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-70"><X className="w-3 h-3" /></button>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-center gap-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden min-w-0">
             <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="font-black text-lg text-gray-900 uppercase tracking-tight">Active Directory</h2>
                <div className="p-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">
                   Row count: {filteredUsers.length}
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50/50 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                     <th className="px-8 py-5">Member</th>
                     <th className="px-8 py-5">Access Group</th>
                     <th className="px-8 py-5">System ID</th>
                     <th className="px-8 py-5 text-right">Management</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-purple-50 flex items-center justify-center border border-indigo-100/50">
                                 <span className="text-indigo-600 font-black text-xs">{(u.name?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()}</span>
                              </div>
                              <div>
                                 <div className="text-sm font-black text-gray-900">{u.name || 'Incognito User'}</div>
                                 <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {u.email}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border leading-none ${u.role === 'ROLE_ADMIN' || u.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                             {u.role === 'ROLE_ADMIN' || u.role === 'ADMIN' ? 'Administrator' : 'General Member'}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <code className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                             {u.id?.substring(0, 12)}...
                           </code>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleUpdateRole(u.id, u.role)}
                                title="Toggle Permissions"
                                className="p-2.5 hover:bg-white hover:text-indigo-600 rounded-xl border border-transparent hover:border-gray-200 shadow-sm transition-all group/btn"
                              >
                                {u.role === 'ROLE_ADMIN' || u.role === 'ADMIN' ? <Users className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                title="Revoke Access"
                                className="p-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl border border-transparent hover:border-red-100 shadow-sm transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center gap-2">
                              <Search className="w-8 h-8 text-gray-200 mb-2" />
                              <p className="text-sm text-gray-400 font-bold">No members found matching your search.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
               </table>
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

export default AdminUserManagementPage;
