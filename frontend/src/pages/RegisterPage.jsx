import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Sparkles, Loader2, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSchema } from '../schemas/auth';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import loginIllustration from '../assets/login-illustration.png';
import logo from '../assets/logo.png';

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const [serverError, setServerError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const methods = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      role: 'ROLE_USER'
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  React.useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      if (error === 'invalid_domain') {
        toast.error('Access Denied: Please use your SLIIT student or staff email.', {
          duration: 5000,
          id: 'auth-error'
        });
        setServerError('Unauthorized: Only @my.sliit.lk or @sliit.lk domains are permitted.');
      } else if (error === 'user_already_exists') {
        toast.error('Account already exists. Please login instead.', {
          duration: 5000,
          id: 'auth-error'
        });
        setServerError('An account already exists with this Google profile.');
      } else {
        toast.error('Registration failed. Please try again.', { id: 'auth-error' });
        setServerError('An unexpected error occurred during Google Signup.');
      }
      navigate('/register', { replace: true });
    }
  }, [searchParams, navigate]);

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

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    localStorage.clear();
    toast.loading('Provisioning SLIIT Account...', { id: 'google-signup' });
    
    // Derived from VITE_API_URL (removes /api/v1 suffix)
    const baseUrl = import.meta.env.VITE_API_URL.split('/api/v1')[0];
    
    setTimeout(() => {
      // Append action=signup to distinguish from login attempts
      window.location.href = `${baseUrl}/oauth2/authorization/google?action=signup`;
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden md:min-h-[min(800px,90vh)]"
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
                Connect with the pulse of the campus. Stay notified, manage your journey, and excel together.
              </p>
              
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                <div className="w-8 h-2 bg-nexer-brand-secondary rounded-full" />
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col relative bg-white overflow-y-auto max-h-[min(800px,90vh)]">
          <div className="mb-8 flex flex-col items-start gap-6">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-nexer-sm border border-slate-100 p-2 transform rotate-3 hover:rotate-0 transition-transform">
              <img src={logo} alt="SLIIT Nexer" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Create an Account
              </h1>
              <p className="text-slate-500 font-medium text-base sm:text-lg">
                Create your Smart Campus profile today
              </p>
            </div>
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
                name="fullName" 
                label="Your Full Name" 
                placeholder="e.g. John Doe"
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
                  className="w-full py-3.5 sm:py-4 bg-nexer-brand-secondary hover:bg-teal-700 text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
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

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative px-4 bg-white text-xs font-bold uppercase tracking-widest text-slate-300 mx-auto block w-max">
                    or express with
                  </span>
                </div>

                <button
                  onClick={handleGoogleSignup}
                  type="button"
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl border border-slate-200 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 group"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-nexer-brand-secondary" />
                  ) : (
                    <Chrome className="w-5 h-5 text-[#ea4335]" />
                  )}
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-10 mb-4 text-center">
            <p className="text-slate-500 font-medium">
              Already have a profile?{' '}
              <Link to="/login" className="text-nexer-brand-secondary font-black hover:underline underline-offset-4">
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
