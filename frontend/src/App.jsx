import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { Toaster } from 'react-hot-toast';


// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import { NotificationProvider } from './context/NotificationContext';

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
import UserManagementPage from './pages/dashboard/UserManagementPage';
import BookingsPage from './pages/dashboard/BookingsPage';
import AdminBookingsPage from './pages/dashboard/AdminBookingsPage';
import AdminCheckInVerifyPage from './pages/dashboard/AdminCheckInVerifyPage';
import NotificationSettingsPage from './pages/dashboard/NotificationSettingsPage';
import UserTickets from './pages/dashboard/UserTickets';
import AdminGlobalQueue from './pages/dashboard/AdminGlobalQueue';
import TechnicianTasks from './pages/dashboard/TechnicianTasks';
import TicketDetails from './pages/dashboard/TicketDetails';
import FacilitiesPage from './pages/dashboard/FacilitiesPage';
import ManageFacilitiesPage from './pages/dashboard/ManageFacilitiesPage';





// Role-based entry point / redirector
const RoleBasedRedirect = () => {
  const { user, token, loading } = useAuth();

  if (loading) return null;
  if (!token || !user) return <Navigate to="/login" replace />;

  const normalizedRole = user.role?.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;

  if (normalizedRole === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
  if (normalizedRole === 'ROLE_TECHNICIAN') return <Navigate to="/technician" replace />;
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
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#ffffff',
            color: '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #f1f5f9'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
              },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-nexer-bg-base text-nexer-text-body font-sans selection:bg-nexer-brand-primary/10">
        <NotificationProvider>
          <Routes>
            {/* Authentication Routes (Public only, redirected if already logged in) */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            <Route path="/otp" element={
              <PublicRoute>
                <OtpPage />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            } />
            
            <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin/bookings/check-in" element={<AdminCheckInVerifyPage />} />

            {/* Role-Specific Protected Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              {/* User Access ONLY */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/user/tickets" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserTickets />
                </ProtectedRoute>
              } />
              
              {/* Admin Access ONLY */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/bookings" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminBookingsPage />
                </ProtectedRoute>
              } />

              <Route path="/bookings" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <BookingsPage />
                </ProtectedRoute>
              } />

              {/* Technician Access ONLY */}
              <Route path="/technician" element={
                <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              } />

              {/* Incident Tickets Module */}
              <Route path="/admin/tickets" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminGlobalQueue />
                </ProtectedRoute>
              } />

              <Route path="/technician/tasks" element={
                <ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                  <TechnicianTasks />
                </ProtectedRoute>
              } />

              <Route path="/tickets/:id" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
                  <TicketDetails />
                </ProtectedRoute>
              } />

              {/* Universal User Profile (Accessed by all logged-in roles) */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Facilities Module (Member 1) */}
              <Route path="/facilities" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
                  <FacilitiesPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/facilities" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageFacilitiesPage />
                </ProtectedRoute>
              } />

              {/* Notification Settings (all logged-in roles) */}
              <Route path="/notifications/settings" element={
                <ProtectedRoute>
                  <NotificationSettingsPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Global Redirects */}
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </NotificationProvider>
      </div>
    </Router>
  );
}

export default App;
