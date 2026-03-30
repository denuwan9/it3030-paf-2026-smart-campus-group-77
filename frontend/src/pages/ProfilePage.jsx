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
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ImageUpload from '../components/profile/ImageUpload';
import toast from 'react-hot-toast';

// Zod Schema for Validation
const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').optional().or(z.literal('')),
  department: z.string().min(2, 'Department is required').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional().or(z.literal('')),
});

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      department: user?.department || '',
      bio: user?.bio || '',
    },
  });

  // Sync with user context if it changes
  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName);
      setValue('phoneNumber', user.phoneNumber || '');
      setValue('department', user.department || '');
      setValue('bio', user.bio || '');
      setProfileImageUrl(user.profileImageUrl || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const updateData = { ...data, profileImageUrl };
      const response = await userService.updateProfile(updateData);
      
      if (response.data.success) {
        updateUserProfile(response.data.data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your institutional identity and contact details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">{user?.role?.replace('ROLE_', '')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-lumina-sm flex flex-col items-center text-center">
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
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-100 rounded-[2.5rem] shadow-lumina-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              {isDirty && (
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  Unsaved Changes
                </span>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input 
                    {...register('fullName')}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.fullName ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800`}
                  />
                  {errors.fullName && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{errors.fullName.message}</p>}
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2 opacity-60">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Institutional Email
                  </label>
                  <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-500 cursor-not-allowed">
                    {user?.email}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <input 
                    {...register('phoneNumber')}
                    placeholder="+94 7X XXX XXXX"
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.phoneNumber ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800`}
                  />
                  {errors.phoneNumber && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{errors.phoneNumber.message}</p>}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" /> Department / Unit
                  </label>
                  <input 
                    {...register('department')}
                    placeholder="e.g. Computing Cabinet"
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.department ? 'border-rose-500' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800`}
                  />
                  {errors.department && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{errors.department.message}</p>}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Bio / Brief Description
                </label>
                <textarea 
                  {...register('bio')}
                  rows={4}
                  placeholder="Tell us about your campus role..."
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.bio ? 'border-rose-500' : 'border-slate-100'} rounded-3xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-slate-800 resize-none`}
                />
                {errors.bio && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{errors.bio.message}</p>}
              </div>

              <div className="pt-6 border-t border-slate-50">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Security Summary Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-50/50 border border-blue-100 p-6 rounded-[2rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-black text-slate-800">Campus Trust & Security</h4>
              <p className="text-[11px] text-slate-500 font-medium">Your data is transmitted securely and stored in our institutional private cloud.</p>
            </div>
            <button className="text-xs font-black text-blue-600 hover:underline underline-offset-4">
              Security Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
