import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Chrome, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginSchema } from '../schemas/auth';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import loginIllustration from '../assets/login-illustration.png';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      if (error === 'invalid_domain') {
        toast.error('Access Denied: Please use your SLIIT student or staff email.', {
          duration: 5000,
          id: 'auth-error'
        });
        setServerError('Unauthorized: Only @my.sliit.lk or @sliit.lk domains are permitted.');
      } else if (error === 'user_not_found') {
        toast.error('No existing account found. Please create an account first.', {
          duration: 5000,
          id: 'auth-error'
        });
        setServerError('No Nexer account associated with this Google ID.');
      } else if (error === 'account_exists') {
        toast.error('Account already exists. Please login with your password.', {
          duration: 5000,
          id: 'auth-error'
        });
        setServerError('An account with this email already exists.');
      } else {
        toast.error('Authentication failed. Please try again.', { id: 'auth-error' });
        setServerError('An unexpected error occurred during Google Sign-In.');
      }
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        if (result.user.role === 'ROLE_ADMIN') navigate('/admin');
        else if (result.user.role === 'ROLE_TECHNICIAN') navigate('/technician');
        else navigate('/dashboard');
      } else {
        setServerError(result.error || 'Invalid credentials provided.');
      }
    } catch (err) {
      setServerError('A network error occurred. Please try again later.');
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    localStorage.clear();
    toast.loading('Verifying SLIIT Credentials...', { id: 'google-login' });
    
    // Derived from VITE_API_URL (removes /api/v1 suffix)
    const baseUrl = import.meta.env.VITE_API_URL.split('/api/v1')[0];
    
    setTimeout(() => {
      // Append action=login to distinguish from signup attempts
      window.location.href = `${baseUrl}/oauth2/authorization/google?action=login`;
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden md:min-h-[700px]"
      >
        {/* Left Side: Illustration & Branding */}
        <div className="hidden md:flex md:w-1/2 bg-nexer-bg-accent p-12 flex-col justify-between items-center text-center relative overflow-hidden">
          
          
          <div className="flex-1 flex flex-col justify-center items-center gap-10">
            <motion.img 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={loginIllustration} 
              alt="SLIIT Nexer Illustration" 
              className="max-h-[350px] object-contain drop-shadow-2xl"
            />
            
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                University Resource Management
              </h2>
              <p className="text-slate-600 max-w-[620px] font-medium leading-relaxed">
                The centralized operations hub for students to explore, manage, and succeed in the smart campus.
              </p>
              
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-8 h-2 bg-nexer-brand-primary rounded-full" />
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative bg-white">
          <div className="mb-8 flex flex-col items-start gap-6">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-nexer-sm border border-slate-100 p-2 transform -rotate-3 hover:rotate-0 transition-transform">
              <img src={logo} alt="SLIIT Nexer" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Welcome to SLIIT Nexar
              </h1>
              <p className="text-sm sm:text-base text-slate-500 font-medium">
                Please login to your system account
              </p>
            </div>
          </div>

          <Alert 
            type="error" 
            message={serverError} 
            className="mb-4" 
            onClose={() => setServerError('')}
          />

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput 
                name="email" 
                label="Official Email " 
                placeholder="you@sliit.lk"
                autoFocus
              />

              <div className="space-y-1">
                <div className="flex justify-between px-1">
                  <label className="text-sm font-bold text-slate-700">Access Password</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-bold text-slate-400 hover:text-nexer-brand-primary transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <FormInput 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full py-3.5 sm:py-4 bg-[#FF7A30] hover:bg-[#ff6a1a] text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading || isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Login to Hub
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative px-4 bg-white text-xs font-bold uppercase tracking-widest text-slate-300 mx-auto block w-max">
                    or access with
                  </span>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl border border-slate-200 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 group"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-nexer-brand-primary" />
                  ) : (
                    <Chrome className="w-5 h-5 text-[#ea4335]" />
                  )}
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              Are you new?{' '}
              <Link to="/register" className="text-nexer-brand-primary font-black hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
