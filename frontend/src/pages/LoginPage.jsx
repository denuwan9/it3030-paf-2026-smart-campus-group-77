import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Chrome, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const { login, logout, loading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      if (result.user.role === 'ROLE_ADMIN') navigate('/admin/bookings');
      else if (result.user.role === 'ROLE_TECHNICIAN') navigate('/tickets');
      else navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Clear any existing session to prevent "Already Logged In" conflicts
    localStorage.clear();
    
    toast.loading('Opening Google Account Selection...', {
      icon: '🔐',
      duration: 3000
    });

    // Short delay for UX before redirecting to Spring Boot OAuth endpoint
    setTimeout(() => {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass p-8 rounded-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 rounded-xl mb-4">
            <LogIn className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to Smart Campus Hub</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl transition-all mb-6 shadow-lg shadow-white/5 active:scale-95 disabled:opacity-70"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          ) : (
            <Chrome className="w-5 h-5 text-red-500" />
          )}
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
          <div className="relative flex justify-center text-sm uppercase"><span className="px-2 bg-slate-900 text-slate-500">Or continue with email</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@sliit.lk"
                className={`input-field pl-11 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-primary-400 hover:text-primary-300">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`input-field pl-11 ${errors.password ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">Sign up now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
