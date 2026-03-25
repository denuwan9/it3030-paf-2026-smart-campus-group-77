import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
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
