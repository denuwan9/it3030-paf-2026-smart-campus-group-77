import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading, getUserRole } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading authentication...</div>;
  }

  if (!user) {
    // Redirect to login if literal user is not logged in
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();

  // RBAC check: ADMIN can access anything, USER can only access USER-level pages
  if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
    return <div className="p-8 text-center text-red-600 font-bold">Access Denied: Admin privileges required.</div>;
  }

  // If role is sufficient, render the nested components
  return <Outlet />;
};

export default ProtectedRoute;
