import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import FormInput from '../components/common/FormInput';
import { FormProvider } from 'react-hook-form';
import logo from '../assets/logo.png';

const schema = z.object({
  email: z.string()
    .email('Invalid email address')
    .refine(email => email.endsWith('@sliit.lk') || email.endsWith('@my.sliit.lk'), {
      message: "Only SLIIT institutional emails are allowed",
    }),
});

const ForgotPasswordPage = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', data);
      toast.success(response.data.message || 'Reset link sent if account exists');
    } catch (error) {
      // toast.error is handled by axiosInstance interceptor generally, 
      // but we can add specific handling if needed
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-nexer-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-nexer-brand-primary" />
        
        <div className="text-center mb-8 sm:mb-10 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-nexer-sm border border-slate-100 p-2.5 sm:p-3 mb-5 sm:mb-6 relative group">
             <img src={logo} alt="SLIIT Nexer Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
             <div className="absolute -top-1.5 -right-1.5 w-6 h-6 sm:w-8 sm:h-8 bg-nexer-brand-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-nexer-brand-primary animate-spin-slow" />
             </div>
             <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 text-nexer-brand-secondary" />
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Identity Recovery</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 sm:mt-3 px-2 sm:px-4 leading-relaxed">
            Enter your institutional email to receive a secure recovery link.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <FormInput 
              name="email" 
              label="Official Email" 
              placeholder="you@sliit.lk"
              autoFocus
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 group h-11 sm:h-12 text-xs sm:text-sm font-black"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Initiating...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </FormProvider>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-50 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-black text-slate-400 hover:text-nexer-brand-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Authentication
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
