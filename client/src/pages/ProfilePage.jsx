import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { 
  User as UserIcon, 
  Lock, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  ArrowLeft, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

const ProfilePage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profilePictureUrl: '',
    provider: ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        const data = response.data.data;
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          profilePictureUrl: data.profilePictureUrl || user?.user_metadata?.avatar_url || '',
          provider: data.provider || 'EMAIL'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Only show error if it's not an authentication issue (handled by ProtectedRoute)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          showToast('error', 'Failed to load profile data.');
        }
      } finally {
        setLoading(false);
      }

    };
    fetchProfile();
  }, [user]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateProfile({
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
        profilePictureUrl: profileData.profilePictureUrl
      });
      showToast('success', 'Profile updated successfully!');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }
    
    setSaving(true);
    try {
      await userService.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      showToast('success', 'Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone easily.')) {
        try {
            // Note: endpoint needs to be called via axios
            await userService.updatePreferences({ isActive: false }); // Placeholder or specific deactivate call
            showToast('success', 'Account deactivation requested.');
        } catch (error) {
            showToast('error', 'Failed to deactivate account.');
        }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Account Settings</h1>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
               {profileData.provider === 'google' ? 'Connected via Google' : 'Local Account'}
             </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
            <SettingsNavItem 
                icon={UserIcon} 
                label="Public Profile" 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
            />
            <SettingsNavItem 
                icon={Lock} 
                label="Security" 
                active={activeTab === 'security'} 
                onClick={() => setActiveTab('security')} 
            />
            <SettingsNavItem 
                icon={ShieldCheck} 
                label="Privacy & Safety" 
                active={activeTab === 'privacy'} 
                onClick={() => setActiveTab('privacy')} 
            />
            <div className="pt-4 mt-4 border-t border-gray-200">
                <button 
                    onClick={handleDeactivate}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-bold"
                >
                    <Trash2 className="w-4 h-4" />
                    Deactivate Account
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-8 pb-8">
                  <div className="relative -mt-16 mb-6 inline-block">
                    <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                      <div className="w-full h-full rounded-[20px] bg-gray-100 overflow-hidden relative group">
                        {profileData.profilePictureUrl ? (
                          <img src={profileData.profilePictureUrl} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                            <UserIcon className="w-12 h-12 text-indigo-200" />
                          </div>
                        )}
                        <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                        placeholder="e.g. Denuwan Yasanga"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl outline-none text-sm font-medium text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="tel" 
                          value={profileData.phoneNumber}
                          onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                          placeholder="+94 7X XXX XXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-1">Avatar URL</label>
                      <input 
                        type="url" 
                        value={profileData.profilePictureUrl}
                        onChange={(e) => setProfileData({...profileData, profilePictureUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>
                    <div className="md:col-span-2 pt-4 flex justify-end">
                      <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50 flex items-start gap-4">
                 <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-bold text-indigo-900 mb-1">Verify your information</h4>
                    <p className="text-xs text-indigo-700/80 leading-relaxed">
                      Your name and profile picture are used across the Smart Campus Hub to identify you in resource bookings and technical support tickets.
                    </p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <Lock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-bold">Password Management</h2>
                    <p className="text-xs text-gray-500">Change your account password for enhanced security.</p>
                  </div>
                </div>

                {profileData.provider === 'google' ? (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      Your account is currently linked with **Google OAuth**. Password management is handled through your Google Account settings.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-1">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPasswords ? "text" : "password"} 
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase text-gray-400 ml-1">New Password</label>
                       <input 
                         type={showPasswords ? "text" : "password"} 
                         value={passwordData.newPassword}
                         onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                         className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                         required
                       />
                       <p className="text-[10px] text-gray-400 ml-1">Minimum 8 characters with a special symbol.</p>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase text-gray-400 ml-1">Confirm New Password</label>
                       <input 
                         type={showPasswords ? "text" : "password"} 
                         value={passwordData.confirmPassword}
                         onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                         className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                         required
                       />
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                    </button>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                      >
                        {saving ? 'Updating...' : <><Save className="w-4 h-4" /> Update Password</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center animate-in fade-in zoom-in duration-300">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <ShieldCheck className="w-8 h-8 text-gray-200" />
               </div>
               <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Privacy Settings Coming Soon</h3>
               <p className="text-sm text-gray-400 mt-2">Manage your data visibility and third-party integrations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10 duration-300 ${toast.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'}`}>
           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
           <span className="text-sm font-bold tracking-tight">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

const SettingsNavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-sm font-bold ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
        : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
    {label}
  </button>
);

export default ProfilePage;
