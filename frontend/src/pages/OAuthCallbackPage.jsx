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
    const error = searchParams.get('error');
    
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } else {
      console.error('OAuth callback error:', error);
      // Transfer the error parameter back to login page
      navigate(`/login${error ? `?error=${error}` : ''}`);
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
