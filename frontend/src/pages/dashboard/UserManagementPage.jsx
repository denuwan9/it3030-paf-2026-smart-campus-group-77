import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Users, 
  Settings, 
  Ban, 
  Key, 
  Trash2, 
  ChevronDown,
  UserCheck,
  UserX,
  BadgeCheck,
  Loader2,
  AlertTriangle,
  X,
  RefreshCw
} from 'lucide-react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import AnnouncementForm from '../../components/dashboard/AnnouncementForm';
import { Megaphone, FileDown } from 'lucide-react';
import { generateUserReport } from '../../utils/reportGenerator';

const Modal = ({ isOpen, onClose, title, children, confirmText, onConfirm, variant = 'primary', isLoading = false }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-8 font-medium text-slate-600">
              {children}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={onClose} 
                className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 font-black text-xs tracking-widest rounded-2xl hover:bg-slate-200 transition-all uppercase"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-6 py-3.5 ${
                  variant === 'danger' ? 'bg-rose-600 shadow-rose-500/20' : 'bg-indigo-600 shadow-indigo-500/20'
                } text-white font-black text-xs tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg uppercase flex items-center justify-center gap-2`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  
  // Edit Form State
  const [editData, setEditData] = useState({ role: '', password: '' });
  const [passwordError, setPasswordError] = useState('');


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load user directory.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedUser) return;
    try {
      setIsUpdating(true);
      await userService.adminUpdateUser(selectedUser.id, { isActive: !selectedUser.isActive });
      toast.success(`User account ${selectedUser.isActive ? 'DEACTIVATED' : 'ACTIVATED'} successfully.`);
      fetchUsers();
      setShowStatusModal(false);
    } catch (error) {
      toast.error('Update failed. Please check your permissions.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsUpdating(true);
      await userService.adminDeleteUser(selectedUser.id);
      toast.success('User record successfully removed from the system.');
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Delete operation failed. System dependency conflict.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      setIsUpdating(true);
      const data = { role: editData.role };
      
      if (editData.password && editData.password.trim() !== '') {
        // Password Validation Pattern: 8+ chars, 1 Upper, 1 Lower, 1 Num
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(editData.password)) {
          const errorMsg = 'Secret must be 8+ chars with Uppercase, Lowercase, and Number.';
          setPasswordError(errorMsg);
          toast.error(errorMsg, {
            duration: 4000,
            icon: '⚠️'
          });
          return;
        }

        data.password = editData.password;
      }
      
      await userService.adminUpdateUser(selectedUser.id, data);
      toast.success('User profile updated successfully.');
      fetchUsers();
      setShowEditModal(false);
      setEditData({ role: '', password: '' });
      setPasswordError('');

    } catch (error) {
      toast.error('Identity update failed. Check administrative permissions.');
    } finally {
      setIsUpdating(false);
    }
  };


  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      toast.loading('Synthesizing system report...', { id: 'report-download' });
      
      // We pass the entire users list as requested (all users)
      generateUserReport(users);
      
      toast.success('System report downloaded successfully.', { id: 'report-download' });
    } catch (error) {
      toast.error('Report synthesis failed. Check system logs.', { id: 'report-download' });
    } finally {
      setIsDownloading(false);
    }
  };


  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* USER MANAGEMENT HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-8 md:p-12 shadow-nexer-lg border border-slate-100"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500 blur-[100px]" />
        </div>
        
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 md:gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner group transition-all hover:bg-slate-100">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-nexer-text-header tracking-tight uppercase">
                User Management
              </h1>
              <p className="text-nexer-text-muted text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2 uppercase truncate">
                Manage Platform Users and Permissions
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row bg-slate-50 rounded-2xl p-1.5 border border-slate-200 w-full sm:w-auto">
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 rounded-xl flex items-center justify-center gap-2 text-white font-black text-[10px] sm:text-xs tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              MEMBERS ( {users.length} )
            </button>
            <button 
              onClick={fetchUsers}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-black text-[10px] sm:text-xs tracking-widest group active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              REFRESH DATA
            </button>
            <div className="w-px h-6 bg-slate-200 self-center hidden sm:block mx-1" />
            <button 
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-purple-600 transition-all font-black text-[10px] sm:text-xs tracking-widest group active:scale-95"
            >
              <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              SEND ANNOUNCEMENT
            </button>
          </div>
        </div>
      </motion.div>

      {/* SYSTEM REGISTRY SEARCH */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6"
      >
        <div className="text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">User Directory</h2>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-0.5">
            Campus Access Management
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleDownloadReport}
            disabled={isDownloading || loading}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-bold text-xs hover:bg-emerald-100 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            {isDownloading ? 'PREPARING PDF...' : 'DOWNLOAD REPORT'}
          </button>

          <div className="relative w-full sm:w-64 md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-transparent rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* USER LISTING */}
      <div className="space-y-6">
        <div className="grid grid-cols-12 px-6 sm:px-8 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
          <div className="col-span-12 lg:col-span-3">User Identity</div>
          <div className="hidden lg:block lg:col-span-3">Email Address</div>
          <div className="hidden md:block md:col-span-3 lg:col-span-2">Role</div>
          <div className="hidden md:block md:col-span-3 lg:col-span-2 text-center">Status</div>
          <div className="hidden md:block md:col-span-6 lg:col-span-2 text-right">Actions</div>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 space-y-4">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase animate-pulse">Loading User Records...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-dashed border-slate-200">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200 mb-4" />
                <p className="text-xs sm:text-sm font-bold text-slate-500 px-4 text-center">No users matching your search were detected.</p>
              </div>
            ) : (
              filteredUsers.map((user, idx) => (
                <motion.div
                  layout
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="grid grid-cols-12 items-center bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                >
                  <div className="col-span-12 md:col-span-6 lg:col-span-3 flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden relative flex-shrink-0 ${user.role === 'ROLE_ADMIN' ? 'bg-indigo-600' : user.role === 'ROLE_TECHNICIAN' ? 'bg-amber-500' : 'bg-cyan-500'}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-xs sm:text-sm truncate">{user.fullName}</h3>
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-widest uppercase truncate">
                        {user.role?.replace('ROLE_', '')} ACCOUNT
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block lg:col-span-3 overflow-hidden text-ellipsis px-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 lowercase truncate block">{user.email}</span>
                  </div>
                  
                  <div className="hidden md:block md:col-span-3 lg:col-span-2 px-2">
                    <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 rounded-xl ${
                      user.role === 'ROLE_ADMIN' ? 'bg-indigo-50 text-indigo-600' : 
                      user.role === 'ROLE_TECHNICIAN' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-cyan-600'
                    } font-black text-[8px] sm:text-[9px] tracking-widest border border-current/10 uppercase`}>
                      {user.role?.replace('ROLE_', '')}
                    </span>
                  </div>
                  
                  <div className="hidden md:block md:col-span-3 lg:col-span-2 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-black text-[8px] sm:text-[9px] tracking-widest uppercase border ${
                      user.isActive 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {user.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </div>
                  
                  <div className="col-span-12 md:col-span-12 lg:col-span-2 flex items-center justify-end gap-2 sm:gap-3 mt-4 lg:mt-0 pt-4 md:pt-4 lg:pt-0 border-t md:border-t lg:border-t-0 border-slate-50">
                    <button 
                      onClick={() => { setSelectedUser(user); setShowStatusModal(true); }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-sm border ${
                        user.isActive 
                          ? 'bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-500 hover:text-white' 
                          : 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title={user.isActive ? 'Deactivate Account' : 'Activate Account'}
                    >
                      {user.isActive ? <Ban className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <UserCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                    </button>
                    <button 
                      onClick={() => { 
                        setSelectedUser(user); 
                        setEditData({ role: user.role, password: '' }); 
                        setShowEditModal(true); 
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm border border-slate-100"
                      title="Edit User Details"
                    >
                      <Key className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                    <button 
                      onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm border border-slate-100"
                      title="Delete User Record"
                    >
                      <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODALS SECTION */}
      
      {/* 1. Status Activation/Deactivation Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Override Operational Status"
        confirmText={selectedUser?.isActive ? "Deactivate" : "Activate"}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdating}
        variant={selectedUser?.isActive ? 'danger' : 'primary'}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-slate-600 mb-2">
              Are you sure you want to {selectedUser?.isActive ? 'SUSPEND' : 'RESTORE'} administrative access for:
            </p>
            <p className="text-xl font-black text-slate-800 tracking-tight highlight-indigo">{selectedUser?.fullName}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</p>
            <p className="text-xs font-mono text-slate-500 uppercase">{selectedUser?.id?.split('-')[0]}... // OVERRIDE_READY</p>
          </div>
        </div>
      </Modal>

      {/* 2. Permanent Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="CRITICAL: Personnel Purge"
        confirmText="Confirm Purge"
        onConfirm={handleDeleteUser}
        isLoading={isUpdating}
        variant="danger"
      >
        <div className="space-y-5">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-lg shadow-rose-500/10 scale-110">
            <Trash2 className="w-10 h-10 animate-bounce-subtle" />
          </div>
          <div className="text-center">
            <p className="text-slate-600">
              This action initiates a <span className="text-rose-600 font-bold">PERMANENT DELETION</span> of user records for:
            </p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter mt-1">{selectedUser?.fullName}</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-700">Irreversible Action</span>
            </div>
            <p className="text-xs text-rose-600/70 font-medium leading-relaxed">
              Deleting a user record removes all associated data and security clearance permanently. This action cannot be undone once confirmed.
            </p>
          </div>
        </div>
      </Modal>

      {/* 3. Global Identity Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Update Authorization Node"
        confirmText="Commit Changes"
        onConfirm={handleEditUser}
        isLoading={isUpdating}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-indigo-500">
                <Users className="w-5 h-5" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Target User</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedUser?.fullName}</p>
             </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Authorization Clearance
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all appearance-none"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              >
                <option value="ROLE_USER">OPERATOR (ROLE_USER)</option>
                <option value="ROLE_TECHNICIAN">MAINTENANCE (ROLE_TECHNICIAN)</option>
                <option value="ROLE_ADMIN">CONTROL (ROLE_ADMIN)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1 flex items-center gap-2">
              <Key className="w-3 h-3" /> Master Key Secret Override
            </label>
            <div className="relative group">
              <input 
                type="password"
                placeholder="Enter new identity secret (manual overwrite)"
                className={`w-full px-4 py-3.5 bg-slate-50 border ${passwordError ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200'} rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 ${passwordError ? 'focus:ring-rose-500/5 focus:border-rose-400' : 'focus:ring-indigo-500/5 focus:border-indigo-500'} outline-none transition-all`}
                value={editData.password}
                onChange={(e) => {
                  setEditData({ ...editData, password: e.target.value });
                  if (passwordError) setPasswordError('');
                }}
              />
            </div>
            <AnimatePresence>
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-[10px] font-bold text-rose-500 flex items-center gap-1 overflow-hidden"
                >
                  <AlertTriangle className="w-3 h-3" /> {passwordError}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="mt-2 text-[10px] text-slate-400 font-medium italic px-1">
               * Leave blank to retain current security credentials.
            </p>

          </div>
        </div>
      </Modal>

      {/* 4. Targeted Announcement Modal */}
      {showAnnouncementModal && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 sm:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      Central Broadcast
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 px-1">Transmit Directive to Campus Nodes</p>
                  </div>
                  <button onClick={() => setShowAnnouncementModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <AnnouncementForm 
                  onSuccess={() => setShowAnnouncementModal(false)}
                  onCancel={() => setShowAnnouncementModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default UserManagementPage;
