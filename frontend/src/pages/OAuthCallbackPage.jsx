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
      // Simple JWT decode to extract user info
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        
        const userObj = {
          userId: decoded.userId,
          email: decoded.sub,
          fullName: decoded.fullName,
          role: decoded.role,
          profileImageUrl: decoded.profileImageUrl,
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch (e) {
        console.error('Error decoding OAuth token:', e);
      }
      
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
