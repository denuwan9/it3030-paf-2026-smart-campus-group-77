import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerSchema } from '../schemas/auth';
import FormInput from '../components/common/FormInput';
import Alert from '../components/common/Alert';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-lumina-bg-base overflow-y-auto py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-lumina-brand-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[50%] h-[50%] bg-lumina-brand-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[520px] z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-lumina-lg border border-slate-100 p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-8 opacity-10">
            <Sparkles className="w-12 h-12 text-lumina-brand-secondary" />
          </div>

          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-lumina-brand-secondary/10 rounded-2xl mb-6 border border-lumina-brand-secondary/10">
              <UserPlus className="w-7 h-7 text-lumina-brand-secondary" />
            </div>
            <h1 className="text-3xl font-black text-lumina-text-header tracking-tight mb-2">
              Join Lumina
            </h1>
            <p className="text-lumina-text-body font-medium">
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
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
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

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-lumina-text-header ml-1">Account Role</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ShieldCheck className="w-5 h-5 text-slate-400 group-focus-within:text-lumina-brand-primary transition-colors" />
                  </div>
                  <select
                    {...methods.register('role')}
                    className="w-full pl-12 pr-4 py-3 bg-lumina-bg-surface border border-slate-200 rounded-2xl outline-none transition-all focus:border-lumina-brand-primary focus:ring-4 focus:ring-lumina-brand-primary/10 appearance-none text-lumina-text-body font-medium"
                  >
                    <option value="ROLE_USER">Standard Member</option>
                    <option value="ROLE_TECHNICIAN">Campus Technician</option>
                    <option value="ROLE_ADMIN">System Administrator</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full py-4 bg-lumina-brand-secondary hover:bg-lumina-brand-secondary/90 text-white font-bold rounded-2xl transition-all shadow-lumina-md active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {loading || isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : 'Establish Profile'}
              </button>
            </form>
          </FormProvider>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-lumina-text-body font-medium">
              Already have a profile?{' '}
              <Link to="/login" className="text-lumina-brand-secondary font-bold hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-slate-400 font-medium">
          By registering, you agree to our Institutional Code of Conduct.
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
