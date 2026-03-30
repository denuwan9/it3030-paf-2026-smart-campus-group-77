import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

// Dashboard Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TechnicianDashboard from './pages/dashboard/TechnicianDashboard';

// Role-based entry point / redirector
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'ROLE_TECHNICIAN') return <Navigate to="/technician" replace />;
  return <Navigate to="/dashboard" replace />;
};

const Unauthorized = () => (
  <div className="h-screen flex flex-col items-center justify-center p-4 text-center bg-nexer-bg-base">
    <div className="w-20 h-20 bg-nexer-status-error/10 rounded-3xl flex items-center justify-center mb-6 border border-nexer-status-error/20">
      <span className="text-4xl text-nexer-status-error font-black">403</span>
    </div>
    <h1 className="text-3xl font-bold mb-2 text-nexer-text-header">Access Denied</h1>
    <p className="text-nexer-text-body mb-8 max-w-sm">
      You don't have the required permissions to access this campus module. 
      Please contact the system administrator if you believe this is an error.
    </p>
    <button 
      onClick={() => window.history.back()} 
      className="px-8 py-2.5 bg-nexer-bg-surface border border-slate-200 hover:bg-slate-50 text-nexer-text-header font-semibold rounded-xl transition-all active:scale-95 shadow-nexer-sm"
    >
      Return to Safety
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-nexer-bg-base text-nexer-text-body font-sans selection:bg-nexer-brand-primary/10">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role-Specific Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            {/* User Access ONLY */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Access ONLY */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Technician Access ONLY */}
            <Route path="/technician" element={
              <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            } />

            {/* Universal User Profile (Accessed by all logged-in roles) */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Global Redirects */}
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
