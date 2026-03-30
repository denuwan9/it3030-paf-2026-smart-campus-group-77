import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexer-brand-primary"></div>
          <p className="text-slate-500 text-sm animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    // Save the location the user was trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    // Normalize roles (handle both 'ADMIN' and 'ROLE_ADMIN')
    const normalizedUserRole = user?.role?.startsWith('ROLE_') ? user.role : `ROLE_${user?.role}`;
    const normalizedAllowedRoles = allowedRoles.map(role => role.startsWith('ROLE_') ? role : `ROLE_${role}`);
    
    const isAuthorized = normalizedAllowedRoles.includes(normalizedUserRole);

    if (!isAuthorized) {
      // Redirect back to their authorized "home" path instead of an unauthorized page
      const rolePaths = {
        'ROLE_ADMIN': '/admin',
        'ROLE_TECHNICIAN': '/technician',
        'ROLE_USER': '/dashboard'
      };
      const redirectPath = rolePaths[normalizedUserRole] || '/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
