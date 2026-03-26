import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginButton from './components/LoginButton';
import ProfilePage from './pages/ProfilePage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import OTPPage from './pages/OTPPage';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

const Home = () => {
  const { user, getUserRole, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium tracking-tight">Loading session...</div>;
  }
  
  if (user) {
    const role = getUserRole();
    return <Navigate to={role === 'ROLE_ADMIN' || role === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }

  return <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const { user, getUserRole, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium tracking-tight">Loading session...</div>;
  }

  if (user) {
    const role = getUserRole();
    return <Navigate to={role === 'ROLE_ADMIN' || role === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Protected Routes for Users */}
            <Route element={<ProtectedRoute requiredRole="ROLE_USER" />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Route>
            
            {/* Alias for common path */}
            <Route path="/dashboard" element={<Navigate to="/user-dashboard" replace />} />

            {/* Protected Routes for Admins */}
            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
              <Route path="/admin-dashboard" element={<AdminUserManagementPage />} />
            </Route>

            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
