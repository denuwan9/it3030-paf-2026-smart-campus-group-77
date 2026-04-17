import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute component ensures that authenticated users cannot access
 * public-only pages like Login, Register, or Forgot Password.
 * If a user is logged in, it redirects them to their appropriate dashboard.
 */
const PublicRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexer-brand-primary"></div>
          <p className="text-slate-500 text-sm animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to their role-appropriate dashboard
  if (token && user) {
    const normalizedRole = user.role?.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;
    
    if (normalizedRole === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (normalizedRole === 'ROLE_TECHNICIAN') return <Navigate to="/technician" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, allow access to public routes
  return children ? children : <Outlet />;
};

export default PublicRoute;
