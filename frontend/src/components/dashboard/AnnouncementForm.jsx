import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Megaphone, Users, Shield, User, Loader2, AlertCircle, ChevronDown, Search } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const announcementSchema = z.object({
  targetType: z.enum(['ALL', 'ROLE', 'USER']),
  targetValue: z.string().min(1, 'Please select a target'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message too long'),
});

const AnnouncementForm = ({ onSuccess, onCancel }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      targetType: 'ALL',
      targetValue: 'ALL_USERS',
      message: '',
    },
  });

  const targetType = watch('targetType');

  useEffect(() => {
    if (targetType === 'USER') {
      fetchUserSummary();
    } else if (targetType === 'ROLE') {
      setValue('targetValue', 'ROLE_USER');
    } else {
      setValue('targetValue', 'ALL_USERS');
    }
  }, [targetType, setValue]);

  const fetchUserSummary = async () => {
    setLoadingUsers(true);
    try {
      const res = await adminService.getUserSummary();
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load user list');
    } finally {
      setLoadingUsers(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await adminService.createAnnouncement(data);
      if (res.data.success) {
        toast.success(`Announcement broadcast to ${res.data.data.recipientCount} users!`);
        onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Target Type Selection */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
          <Megaphone className="w-3 h-3" /> Broadcast Scope
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'ALL', label: 'All Users', icon: Users },
            { id: 'ROLE', label: 'By Role', icon: Shield },
            { id: 'USER', label: 'Specific', icon: User },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setValue('targetType', item.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                targetType === item.id
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Target Value Selection */}
      <AnimatePresence mode="wait">
        {targetType === 'ROLE' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Target Role</label>
            <div className="relative">
              <select
                {...register('targetValue')}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
              >
                <option value="ROLE_USER">OPERATORS (ROLE_USER)</option>
                <option value="ROLE_TECHNICIAN">MAINTENANCE (ROLE_TECHNICIAN)</option>
                <option value="ROLE_ADMIN">CONTROL (ROLE_ADMIN)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </motion.div>
        )}

        {targetType === 'USER' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Personnel</label>
            <div className="relative">
              {loadingUsers ? (
                <div className="w-full h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 italic text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Mapping registry...
                </div>
              ) : (
                <>
                  <select
                    {...register('targetValue')}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  >
                    <option value="">Select a user...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role.replace('ROLE_', '')})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Component */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
          <span>Message Content</span>
          <span className={`${watch('message')?.length > 450 ? 'text-rose-500' : ''}`}>{watch('message')?.length || 0} / 500</span>
        </label>
        <div className="relative group">
          <textarea
            {...register('message')}
            placeholder="Describe the system event or administrative directive..."
            rows={4}
            className={`w-full px-5 py-4 bg-slate-50 border-2 ${
              errors.message ? 'border-rose-200 ring-4 ring-rose-500/5' : 'border-slate-100'
            } rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 ${
              errors.message ? 'focus:ring-rose-500/5 focus:border-rose-300' : 'focus:ring-indigo-500/5 focus:border-indigo-500/20'
            } outline-none transition-all resize-none`}
          />
          {errors.message && (
            <div className="absolute top-4 right-4 text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {errors.message && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.message.message}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black text-[10px] tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all uppercase"
        >
          Abort
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white font-black text-[10px] tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all uppercase flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Megaphone className="w-4 h-4" />
              Pulse Announcement
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
