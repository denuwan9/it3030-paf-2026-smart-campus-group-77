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
    <div className="flex items-center justify-center p-4 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 p-8 sm:p-10 rounded-[2.5rem] shadow-lumina-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-lumina-brand-primary" />
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-lumina-brand-primary/10 rounded-3xl mb-6 relative">
             <RefreshCw className="w-8 h-8 text-lumina-brand-primary animate-spin-slow" />
             <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-lumina-brand-secondary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Identity Recovery</h1>
          <p className="text-slate-500 font-medium mt-3 px-4">
            Enter your institutional email to receive a secure recovery link.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormInput 
              name="email" 
              label="Official Email" 
              placeholder="you@sliit.lk"
              autoFocus
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 group h-12"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
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

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-lumina-brand-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Authentication
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
