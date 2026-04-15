import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import FormInput from '../components/common/FormInput';
import logo from '../assets/logo.png';

const schema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new one.');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword
      });
      toast.success(response.data.message || 'Password reset successful!');
      navigate('/login');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to reset password. The link might be expired.';
      toast.error(errorMsg);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[80vh]">
        <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-nexer-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-3xl mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Missing Token</h1>
          <p className="text-slate-500 mt-3 mb-8">
            This password reset link is invalid. Please request a new one from the login page.
          </p>
          <Link to="/forgot-password" title="Request new link" className="btn-primary w-full inline-block py-3">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-nexer-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-nexer-brand-secondary" />
        
        <div className="text-center mb-8 sm:mb-10 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-nexer-sm border border-slate-100 p-2.5 sm:p-3 mb-5 sm:mb-6 relative group">
             <img src={logo} alt="SLIIT Nexer" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
             <div className="absolute -top-1.5 -right-1.5 w-6 h-6 sm:w-8 sm:h-8 bg-nexer-brand-secondary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-nexer-brand-secondary" />
             </div>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Set New Password</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 sm:mt-3 px-2 sm:px-4">
            Choose a strong, unique password for your SLIIT Nexer account.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            <FormInput 
              name="newPassword" 
              label="New Password" 
              type="password"
              placeholder="••••••••"
            />

            <FormInput 
              name="confirmPassword" 
              label="Confirm New Password" 
              type="password"
              placeholder="••••••••"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 group h-11 sm:h-12 bg-nexer-brand-secondary hover:bg-nexer-brand-secondary/90 shadow-nexer-md shadow-nexer-brand-secondary/20 text-xs sm:text-sm font-black"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Security...</span>
                </>
              ) : (
                <>
                  <span>Initialize Password</span>
                  <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </FormProvider>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-50 text-center text-[10px] sm:text-xs font-bold text-slate-400">
           SLIIT Nexer SECURITY PROTOCOL V1.0
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
