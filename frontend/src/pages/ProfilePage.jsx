import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, Shield, Calendar, MapPin, Building, Phone } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your campus profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-lg">
            <div className="relative inline-block ml-auto mr-auto">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-primary-500/20 mb-4 mx-auto">
                {user?.fullName?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-slate-900 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
            <p className="text-primary-400 text-sm font-medium tracking-wide mt-1 uppercase">
              {user?.role?.replace('ROLE_', '')}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <button className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-500 transition-all shadow-md">
                Change Avatar
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                Personal Information
              </h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Full Email
                  </p>
                  <p className="text-slate-200 font-medium">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Security Role
                  </p>
                  <p className="text-emerald-400 font-medium font-mono">{user?.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" /> Campus Group
                  </p>
                  <p className="text-slate-200 font-medium">SLIIT IT Faculty</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Joined On
                  </p>
                  <p className="text-slate-200 font-medium">March 2026</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Building className="w-3.5 h-3.5" /> Department
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs border border-slate-700 font-medium">Information Technology</span>
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs border border-slate-700 font-medium">Smart Campus Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
