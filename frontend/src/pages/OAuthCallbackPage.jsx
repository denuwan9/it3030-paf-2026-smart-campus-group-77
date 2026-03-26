import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Logic to manually set token and fetch user info if not in JWT
      // For this implementation, the JWT contains everything
      localStorage.setItem('token', token);
      
      // We force a page reload or a context refresh to pick up the new token
      // simplest way for this demo:
      window.location.href = '/dashboard';
    } else {
      toast.error('Google login failed');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-slate-400">Completing your sign in...</p>
    </div>
  );
};

export default OAuthCallbackPage;
