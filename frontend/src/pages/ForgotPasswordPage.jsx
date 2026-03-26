import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Placeholder for actual API call
    console.log('Forgot password for:', data.email);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Reset link sent to your email');
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 rounded-xl mb-4">
            <RefreshCw className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-slate-400 mt-2">Enter your email and we'll send you a link</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
