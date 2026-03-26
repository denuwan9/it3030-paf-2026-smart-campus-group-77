import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requireVerified = true }) => {
  const { user, loading, getUserRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading session...</div>;
  }

  if (!user) {
    // Redirect to login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  const userRole = getUserRole();
  if (requiredRole && userRole !== requiredRole) {
    // Role mismatch - redirect to their respective dashboard
    if (userRole === 'ROLE_ADMIN') return <Navigate to="/admin/users" replace />;
    if (userRole === 'ROLE_TECHNICIAN') return <Navigate to="/tech-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Check verification status if required
  // We check Supabase's email_confirmed_at OR a custom metadata flag
  const isVerified = user.email_confirmed_at || user.user_metadata?.is_verified;
  
  if (requireVerified && !isVerified) {
    // Redirect to dashboard but with a flag
    // Avoid infinite redirect if already on dashboard
    if (location.pathname === '/dashboard' || location.pathname === '/user-dashboard') {
      return children || <Outlet />;
    }
    return <Navigate to="/dashboard" state={{ unverified: true }} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
