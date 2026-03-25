import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginButton from './components/LoginButton';
import ProfilePage from './pages/ProfilePage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const Home = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Smart Campus Home</h1>
    <p className="mt-4">This is a public page.</p>
    <div className="mt-8">
      <LoginButton />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes for Users */}
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Protected Routes for Admins */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
