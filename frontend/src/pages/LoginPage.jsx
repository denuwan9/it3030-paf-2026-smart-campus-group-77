import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Chrome, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginSchema } from '../schemas/auth';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';

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
    if (error === 'invalid_domain') {
      setServerError('Unauthorized: Only SLIIT institutional emails are permitted.');
      navigate('/login', { replace: true });
    } else if (error) {
      setServerError('Authentication failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await login(data.username, data.password);
      if (result.success) {
        if (result.user.role === 'ROLE_ADMIN') navigate('/admin/bookings');
        else if (result.user.role === 'ROLE_TECHNICIAN') navigate('/tickets');
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
    toast.loading('Redirecting to Google...', { id: 'google-login' });
    setTimeout(() => {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-lumina-bg-base">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-lumina-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-lumina-brand-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-lumina-lg border border-slate-100 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-12 h-12 text-lumina-brand-primary" />
          </div>

          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-lumina-brand-primary/10 rounded-2xl mb-6 border border-lumina-brand-primary/10">
              <LogIn className="w-7 h-7 text-lumina-brand-primary" />
            </div>
            <h1 className="text-3xl font-black text-lumina-text-header tracking-tight mb-2">
              Lumina Portal
            </h1>
            <p className="text-lumina-text-body font-medium">
              Access the Smart Campus Operations Hub
            </p>
          </div>

          <Alert 
            type="error" 
            message={serverError} 
            className="mb-8" 
            onClose={() => setServerError('')}
          />

          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-lumina-bg-surface hover:bg-white text-lumina-text-header font-bold rounded-2xl border border-slate-200 transition-all mb-8 shadow-lumina-sm hover:shadow-lumina-md active:scale-[0.98] disabled:opacity-70 group"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-lumina-brand-primary" />
            ) : (
              <div className="bg-white p-1 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
                <Chrome className="w-4 h-4 text-[#ea4335]" />
              </div>
            )}
            <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-black uppercase tracking-[0.2em] text-slate-300">
              Direct Access
            </span>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput 
                name="username" 
                label="Username / ID" 
                placeholder="Enter your campus ID"
                autoFocus
              />

              <div className="space-y-1">
                <div className="flex justify-between px-1">
                  <label className="text-sm font-bold text-lumina-text-header">Password</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-bold text-lumina-brand-primary hover:underline underline-offset-4"
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

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="btn-primary flex items-center justify-center gap-2 mt-4"
              >
                {loading || isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : 'Sign In to Hub'}
              </button>
            </form>
          </FormProvider>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-lumina-text-body font-medium">
              New to the campus?{' '}
              <Link to="/register" className="text-lumina-brand-primary font-bold hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-slate-400 font-medium">
          &copy; 2026 Smart Campus Infrastructure. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
