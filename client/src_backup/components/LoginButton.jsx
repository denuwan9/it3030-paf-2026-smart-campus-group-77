import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginButton = () => {
  const { loginWithGoogle, user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.email}</span>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={loginWithGoogle}
      className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm font-medium"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
      Sign in with Google
    </button>
  );
};

export default LoginButton;
