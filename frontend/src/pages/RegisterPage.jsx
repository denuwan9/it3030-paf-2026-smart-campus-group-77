import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerSchema } from '../schemas/auth';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import loginIllustration from '../assets/login-illustration.png';

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  
  const methods = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      role: 'ROLE_USER'
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await registerUser(data);
      if (result.success) {
        navigate('/otp', { state: { email: data.email } });
      } else {
        setServerError(result.error || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setServerError('A connection error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[750px]"
      >
        {/* Left Side: Illustration & Branding */}
        <div className="hidden md:flex md:w-1/2 bg-lumina-bg-accent p-12 flex-col justify-between items-center text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 opacity-20">
            <Sparkles className="w-12 h-12 text-lumina-brand-secondary" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center gap-10">
            <motion.img 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={loginIllustration} 
              alt="Lumina Hub Illustration" 
              className="max-h-[350px] object-contain drop-shadow-2xl"
            />
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Join the Hub
              </h2>
              <p className="text-slate-600 max-w-[320px] font-medium leading-relaxed">
                Connect with the pulse of the campus. Stay notified, manage your journey, and excel together.
              </p>
              
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                <div className="w-8 h-2 bg-lumina-brand-secondary rounded-full" />
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative bg-white overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-lumina-brand-secondary/10 rounded-xl flex items-center justify-center border border-lumina-brand-secondary/10">
                <UserPlus className="w-5 h-5 text-lumina-brand-secondary" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-800 uppercase">Lumina Hub</span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Establish Identity
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Create your Smart Campus profile today
            </p>
          </div>

          <Alert 
            type="error" 
            message={serverError} 
            className="mb-8" 
            onClose={() => setServerError('')}
          />

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput 
                name="username" 
                label="Public Username" 
                placeholder="Unique campus handle"
                autoFocus
              />

              <FormInput 
                name="email" 
                label="Institutional Email" 
                placeholder="id@sliit.lk"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput 
                  name="password" 
                  type="password" 
                  label="Password"
                  placeholder="••••••••"
                />
                <FormInput 
                  name="confirmPassword" 
                  type="password" 
                  label="Confirm"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full py-4 bg-lumina-brand-secondary hover:bg-teal-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading || isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Create Profile
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Already have a profile?{' '}
              <Link to="/login" className="text-lumina-brand-secondary font-black hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
