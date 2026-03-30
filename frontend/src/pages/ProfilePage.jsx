import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, Calendar, MapPin, Building, Settings, User, Info } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nexar-text-header">Identity & Access</h1>
          <p className="text-nexar-text-body text-sm sm:text-base font-medium mt-1">Manage institutional credentials and campus permissions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-nexar-text-header font-bold rounded-2xl shadow-nexar-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-nexar-lg text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-nexar-brand-primary" />
            
            <div className="relative inline-block mb-6">
              <div className="w-36 h-36 rounded-[2.5rem] bg-nexar-bg-surface border-4 border-white shadow-nexar-md flex items-center justify-center text-5xl font-black text-nexar-brand-primary transition-transform group-hover:scale-105 duration-500">
                {user?.fullName?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-nexar-md border border-slate-50">
                <div className="w-4 h-4 bg-nexar-status-success rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-nexar-text-header leading-tight px-2">{user?.fullName}</h2>
            <div className="mt-3 inline-flex px-4 py-1.5 bg-nexar-brand-primary/10 rounded-full border border-nexar-brand-primary/5">
              <span className="text-xs font-black text-nexar-brand-primary uppercase tracking-[0.15em]">
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Security Vault</span>
              </button>
              <button className="w-full py-3 bg-nexar-bg-surface border border-slate-100 text-nexar-text-header font-bold rounded-xl hover:bg-slate-50 transition-all">
                Edit Bio
              </button>
            </div>
          </div>

          <div className="bg-nexar-brand-secondary/5 border border-nexar-brand-secondary/10 p-8 rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
              <Shield className="w-24 h-24 text-nexar-brand-secondary" />
            </div>
            <h3 className="text-sm font-black text-nexar-brand-secondary uppercase tracking-widest mb-3">Campus Integrity</h3>
            <p className="text-xs text-nexar-text-body font-medium leading-relaxed">
              Your account is verified by SLIIT Active Directory. All actions are logged for campus security and auditing.
            </p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-nexar-lg overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-nexar-bg-surface/30">
              <h2 className="text-xl font-black text-nexar-text-header flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-nexar-sm">
                  <User className="w-5 h-5 text-nexar-brand-primary" />
                </div>
                Institutional Record
              </h2>
            </div>
            
            <div className="p-6 sm:p-10 space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <section className="space-y-2 group">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-nexar-brand-primary transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Primary Email
                  </p>
                  <p className="text-nexar-text-header font-black text-base sm:text-lg border-b border-transparent group-hover:border-slate-100 transition-all inline-block truncate w-full">
                    {user?.email}
                  </p>
                </section>

                <section className="space-y-2 group">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-nexar-brand-secondary transition-colors">
                    <Shield className="w-3.5 h-3.5" /> Authority level
                  </p>
                  <p className="text-nexar-text-header font-black text-lg font-mono">
                    {user?.role}
                  </p>
                </section>

                <section className="space-y-2 group">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-nexar-brand-primary transition-colors">
                    <Building className="w-3.5 h-3.5" /> Faculty / Division
                  </p>
                  <p className="text-nexar-text-header font-black text-lg">
                    Computing & IT
                  </p>
                </section>

                <section className="space-y-2 group">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-nexar-brand-secondary transition-colors">
                    <Calendar className="w-3.5 h-3.5" /> Enrollment
                  </p>
                  <p className="text-nexar-text-header font-black text-lg">
                    March 2026
                  </p>
                </section>
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Active Departments
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Information Technology', 'Smart Campus Hub', 'Operational Tech'].map((tag) => (
                    <span 
                      key={tag}
                      className="bg-nexar-bg-surface text-nexar-text-body px-5 py-2.5 rounded-2xl text-xs border border-slate-200 font-black hover:border-nexar-brand-primary/30 transition-all cursor-default shadow-nexar-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-nexar-status-warning/5 border border-nexar-status-warning/10 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-nexar-status-warning flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-nexar-text-header mb-1">Pending Verification</h4>
                  <p className="text-xs text-nexar-text-body font-medium leading-relaxed">
                    Contact information (Phone number) needs to be updated. Please visit the Registrar's office for phone verification.
                  </p>
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
