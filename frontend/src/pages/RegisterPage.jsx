import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
    .refine(val => val.endsWith('@sliit.lk') || val.endsWith('.sliit.lk'), {
      message: 'Please use your institution email (@sliit.lk)'
    }),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  role: z.string().optional(),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'ROLE_USER'
    }
  });

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      navigate('/otp', { state: { email: data.email } });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg glass p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600/20 rounded-xl mb-4">
            <UserPlus className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the Smart Campus Operations Hub</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input
                {...register('fullName')}
                type="text"
                placeholder="John Doe"
                className={`input-field pl-11 ${errors.fullName ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input
                {...register('email')}
                type="email"
                placeholder="it231234@sliit.lk"
                className={`input-field pl-11 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Role (For Testing Only)</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <select
                {...register('role')}
                className="input-field pl-11 appearance-none"
              >
                <option value="ROLE_USER">User (Standard)</option>
                <option value="ROLE_ADMIN">Administrator</option>
                <option value="ROLE_TECHNICIAN">Technician</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-6 !bg-emerald-600 hover:!bg-emerald-500"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
