import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isNewlyVerified = queryParams.get('verified') === 'true';
  const domainError = queryParams.get('error') === 'unauthorized_domain';

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { error: signInError } = await signIn(email, password);
    
    if (signInError) {
      const errorMessage = signInError.message || 'Login failed. Please check your credentials.';
      const isUnverified = (signInError.error === "Account not verified") || 
                           errorMessage.toLowerCase().includes('verify');
      
      setError(
        isUnverified ? (
          <span>
            {errorMessage} <Link to={`/verify-otp?email=${encodeURIComponent(email)}`} className="underline font-black text-indigo-700">Verify now</Link>
          </span>
        ) : errorMessage
      );
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await loginWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // If successful, Supabase handles the redirect to Google
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Elevate your campus experience</p>
        </div>

        {isNewlyVerified && (
          <div className="p-4 mb-6 bg-green-50 border border-green-100 text-green-700 text-sm font-bold rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
            Email verified successfully! You can now sign in.
          </div>
        )}

        {domainError && (
          <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
            Access Denied: Only SLIIT campus email addresses are permitted.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">or continue with</div>

        <button 
          onClick={handleGoogleLogin} 
          className="google-button"
          disabled={loading}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Google
        </button>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/signup" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
