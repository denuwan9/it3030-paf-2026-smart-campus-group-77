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

// Role-based entry point
const DashboardHome = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ROLE_ADMIN') return <AdminDashboard />;
  if (user?.role === 'ROLE_TECHNICIAN') return <TechnicianDashboard />;
  return <UserDashboard />;
};

const Unauthorized = () => (
  <div className="h-screen flex flex-col items-center justify-center p-4 text-center bg-lumina-bg-base">
    <div className="w-20 h-20 bg-lumina-status-error/10 rounded-3xl flex items-center justify-center mb-6 border border-lumina-status-error/20">
      <span className="text-4xl text-lumina-status-error font-black">403</span>
    </div>
    <h1 className="text-3xl font-bold mb-2 text-lumina-text-header">Access Denied</h1>
    <p className="text-lumina-text-body mb-8 max-w-sm">
      You don't have the required permissions to access this campus module. 
      Please contact the system administrator if you believe this is an error.
    </p>
    <button 
      onClick={() => window.history.back()} 
      className="px-8 py-2.5 bg-lumina-bg-surface border border-slate-200 hover:bg-slate-50 text-lumina-text-header font-semibold rounded-xl transition-all active:scale-95 shadow-lumina-sm"
    >
      Return to Safety
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-lumina-bg-base text-lumina-text-body font-sans selection:bg-lumina-brand-primary/10">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Module A: Resource Management */}
              <Route path="/resources" element={<UserDashboard />} />
              
              {/* Admin Exclusive */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin/bookings" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminDashboard />} />
              </Route>

              {/* Technician Exclusive */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_TECHNICIAN', 'ROLE_ADMIN']} />}>
                <Route path="/tickets" element={<TechnicianDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* Global Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
