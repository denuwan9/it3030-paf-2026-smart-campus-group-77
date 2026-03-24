import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginButton from './components/LoginButton';
import ProfilePage from './pages/ProfilePage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';

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
        <nav className="p-4 bg-gray-800 text-white flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/admin/users">User Management</Link>
        </nav>

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

          <Route path="/login" element={
            <div className="p-8 text-center">
              <h2 className="text-2xl mb-4">Please log in to continue</h2>
              <LoginButton />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
