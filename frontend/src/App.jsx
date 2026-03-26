import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Simple Placeholders
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">User Dashboard</h1>
    <p className="mt-4 text-slate-400">Welcome to the Smart Campus Hub.</p>
    <button onClick={() => useAuth().logout()} className="mt-4 text-red-400 underline">Logout</button>
  </div>
);

const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-primary-500">Admin Control Panel</h1>
    <p className="mt-4 text-slate-400">System management and user oversight.</p>
    <button onClick={useAuth().logout} className="mt-4 text-red-400 underline">Logout</button>
  </div>
);

const Unauthorized = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center p-8">
    <h1 className="text-4xl font-bold text-red-500">403</h1>
    <p className="text-xl mt-2">Access Denied</p>
    <p className="text-slate-400 mt-4">You don't have permission to view this page.</p>
    <button onClick={() => window.history.back()} className="mt-8 text-primary-400 underline">Go Back</button>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-50 selection:bg-primary-500/30">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TECHNICIAN']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
