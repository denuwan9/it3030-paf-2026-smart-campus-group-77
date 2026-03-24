import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginButton from './components/LoginButton';

const Home = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Smart Campus Home</h1>
    <p className="mt-4">This is a public page.</p>
    <div className="mt-8">
      <LoginButton />
    </div>
  </div>
);

const UserDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-blue-600">User Dashboard</h1>
    <p className="mt-4">Welcome to your personal dashboard.</p>
  </div>
);

const AdminPanel = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-red-600">Admin Panel</h1>
    <p className="mt-4">Reserved for administrators only.</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <nav className="p-4 bg-gray-800 text-white flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/user">User Dashboard</Link>
          <Link to="/admin">Admin Panel</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes for Users */}
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/user" element={<UserDashboard />} />
          </Route>

          {/* Protected Routes for Admins */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<AdminPanel />} />
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
