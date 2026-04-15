import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import FormInput from '../components/common/FormInput';
import logo from '../assets/logo.png';

const schema = z.object({
  email: z.string()
    .email('Invalid email address')
    .refine(email => email.endsWith('@sliit.lk') || email.endsWith('@my.sliit.lk'), {
      message: "Only SLIIT institutional emails are allowed",
    }),
});

const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', data);
      setSubmittedEmail(data.email);
      setIsSent(true);
      toast.success(response.data.message || 'Reset link sent if account exists');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to initiate recovery';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 p-8 sm:p-10 rounded-[2.5rem] shadow-nexer-lg relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-2 ${isSent ? 'bg-green-500' : 'bg-nexer-brand-primary'}`} />
        
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="forgot-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-nexer-sm border border-slate-100 p-3 mb-6 relative group">
                   <img src={logo} alt="SLIIT Nexer Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-nexer-brand-primary/10 rounded-2xl flex items-center justify-center border border-white">
                      <RefreshCw className="w-4 h-4 text-nexer-brand-primary animate-spin-slow" />
                   </div>
                   <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-nexer-brand-secondary" />
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
                  className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-nexer-brand-primary transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Authentication
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-4">Transmission Sent</h2>
              <p className="text-slate-500 font-medium mb-8">
                A secure recovery link has been dispatched to:
                <br />
                <span className="text-slate-900 font-bold block mt-2">{submittedEmail}</span>
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-400 font-medium mb-10">
                Please check your inbox (and spam folder) for further instructions. 
                The link is valid for <span className="text-slate-900 font-bold">15 minutes</span>.
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setIsSent(false)} 
                  className="text-sm font-black text-nexer-brand-primary hover:underline"
                >
                  Didn't receive it? Try another email
                </button>
                
                <div className="pt-8 border-t border-slate-50">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-nexer-brand-primary transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
