import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileText, 
  Shield, 
  Save, 
  Loader2,
  CheckCircle2,
  MapPin,
  Calendar,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Unlock,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ImageUpload from '../components/profile/ImageUpload';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').optional().or(z.literal('')),
  department: z.string().min(2, 'Department is required').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional().or(z.literal('')),
});


const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]/, 'Must contain one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || '');
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'bg-slate-200' });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      department: user?.department || '',
      bio: user?.bio || '',
    },
  });


  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-100' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const newPasswordValue = passwordForm.watch('newPassword');
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPasswordValue));
  }, [newPasswordValue]);

  // Sync with user context if it changes
  useEffect(() => {
    if (user) {
      profileForm.setValue('fullName', user.fullName);
      profileForm.setValue('phoneNumber', user.phoneNumber || '');
      profileForm.setValue('department', user.department || '');
      profileForm.setValue('bio', user.bio || '');
      setProfileImageUrl(user.profileImageUrl || '');

    }
  }, [user, profileForm.setValue]);

  const onProfileSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const updateData = { ...data, profileImageUrl };
      const response = await userService.updateProfile(updateData);
      
      if (response.data.success) {
        updateUserProfile(response.data.data);
        toast.success('Profile updated successfully');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      if (response.data.success) {
        toast.success('Password updated successfully');
        passwordForm.reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Current password might be incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSuccess = (url) => {
    setProfileImageUrl(url);
    // Automatically save profile image update? Or let user click save?
    // User expects to click "Save Changes" for everything.
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Core</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your identity, visibility, and security.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-sm">
          {['profile', 'security'].map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-nexer-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-nexer-sm flex flex-col items-center text-center">
            <ImageUpload 
              currentImage={profileImageUrl} 
              onUploadSuccess={handleImageSuccess} 
            />
            
            <div className="mt-6">
              <h2 className="text-xl font-black text-slate-900">{user?.fullName}</h2>
              <p className="text-sm text-slate-400 font-medium">{user?.email}</p>
            </div>

            <div className="w-full mt-8 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Joined Mar 2026</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Verified Identity</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Your profile is linked to the SLIIT Academic Registry. Critical changes may require administrative approval.
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={profileForm.handleSubmit(onProfileSubmit)} 
              className="bg-white border border-slate-100 rounded-[2.5rem] shadow-nexer-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input 
                      {...profileForm.register('fullName')}
                      className={`w-full px-4 py-3 bg-slate-50 border ${profileForm.formState.errors.fullName ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800`}
                    />
                    {profileForm.formState.errors.fullName && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{profileForm.formState.errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2 opacity-60">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Institutional Email
                    </label>
                    <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-500 cursor-not-allowed">
                      {user?.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </label>
                    <input 
                      {...profileForm.register('phoneNumber')}
                      placeholder="+94 7X XXX XXXX"
                      className={`w-full px-4 py-3 bg-slate-50 border ${profileForm.formState.errors.phoneNumber ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800`}
                    />
                    {profileForm.formState.errors.phoneNumber && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{profileForm.formState.errors.phoneNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Building className="w-3.5 h-3.5" /> Department / Unit
                    </label>
                    <input 
                      {...profileForm.register('department')}
                      placeholder="e.g. Computing Cabinet"
                      className={`w-full px-4 py-3 bg-slate-50 border ${profileForm.formState.errors.department ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800`}
                    />
                    {profileForm.formState.errors.department && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{profileForm.formState.errors.department.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Bio / Brief Description
                  </label>
                  <textarea 
                    {...profileForm.register('bio')}
                    rows={4}
                    placeholder="Tell us about your campus role..."
                    className={`w-full px-4 py-3 bg-slate-50 border ${profileForm.formState.errors.bio ? 'border-rose-500' : 'border-slate-100'} rounded-3xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800 resize-none`}
                  />
                  {profileForm.formState.errors.bio && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{profileForm.formState.errors.bio.message}</p>}
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Identity
                  </button>
                </div>
              </div>
            </motion.form>
          )}



          {activeTab === 'security' && (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="bg-white border border-slate-100 rounded-[2.5rem] shadow-nexer-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-600" />
                  Security Credential Update
                </h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Current Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showCurrentPw ? 'text' : 'password'}
                      {...passwordForm.register('currentPassword')}
                      className={`w-full px-4 py-3 pr-12 bg-slate-50 border ${passwordForm.formState.errors.currentPassword ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all font-bold text-slate-800`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPw ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{passwordForm.formState.errors.currentPassword.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Unlock className="w-3.5 h-3.5" /> New Access Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showNewPw ? 'text' : 'password'}
                        {...passwordForm.register('newPassword')}
                        className={`w-full px-4 py-3 pr-12 bg-slate-50 border ${passwordForm.formState.errors.newPassword ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all font-bold text-slate-800`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPw ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Strength Indicator */}
                    <div className="space-y-2 mt-3 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength Level</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${passwordStrength.color.replace('bg-', 'text-')}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className={`h-full flex-1 transition-all duration-500 ${i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {passwordForm.formState.errors.newPassword && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{passwordForm.formState.errors.newPassword.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirm Access</label>
                    <input 
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      className={`w-full px-4 py-3 bg-slate-50 border ${passwordForm.formState.errors.confirmPassword ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all font-bold text-slate-800`}
                    />
                    {passwordForm.formState.errors.confirmPassword && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{passwordForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button 
                    type="submit"
                    disabled={isSubmitting || passwordStrength.score < 3}
                    className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-900/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    Authorize Change
                  </button>
                  {passwordStrength.score < 3 && newPasswordValue && (
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-2">Requirement: Minimum 'Fair' intensity is required to proceed.</p>
                  )}
                </div>
              </div>
            </motion.form>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-[2rem] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-sm backdrop-blur-md">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-black text-white">Institutional Protection</h4>
              <p className="text-[11px] text-slate-400 font-medium">Your credentials and privacy vectors are encrypted at rest with AES-256 protocols.</p>
            </div>
            <button className="text-xs font-black text-blue-400 hover:text-white transition-colors uppercase tracking-widest">
              Audit Trails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
