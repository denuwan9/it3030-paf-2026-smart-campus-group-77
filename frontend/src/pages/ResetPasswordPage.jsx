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
      // toast.error is handled by axiosInstance interceptor
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[80vh]">
        <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-nexar-lg text-center">
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
    <div className="flex items-center justify-center p-4 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 p-8 sm:p-10 rounded-[2.5rem] shadow-nexar-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-nexar-brand-secondary" />
        
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-nexar-sm border border-slate-100 p-3 mb-6 relative group">
             <img src={logo} alt="Nexar Hub" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-nexar-brand-secondary/10 rounded-2xl flex items-center justify-center border border-white">
                <ShieldCheck className="w-5 h-5 text-nexar-brand-secondary" />
             </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Set New Password</h1>
          <p className="text-slate-500 font-medium mt-3">
            Choose a strong, unique password for your Nexar Hub account.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              className="btn-primary w-full flex items-center justify-center gap-2 group h-12 bg-nexar-brand-secondary hover:bg-nexar-brand-secondary/90 shadow-nexar-md shadow-nexar-brand-secondary/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
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

        <div className="mt-10 pt-8 border-t border-slate-50 text-center text-xs font-bold text-slate-400">
           Nexar HUB SECURITY PROTOCOL V1.0
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
