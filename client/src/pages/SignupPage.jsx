import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import '../styles/Auth.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Trigger Supabase signup FIRST to get the UUID
      const { data: supabaseData, error: supabaseError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName
      });

      if (supabaseError) throw supabaseError;
      const supabaseId = supabaseData.user?.id;

      // 2. Call our backend with the Supabase UUID via authService
      try {
        await authService.signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          supabaseId: supabaseId
        });
      } catch (apiError) {
        // Handle validation errors from backend
        const errorMessage = apiError.response?.data?.message || apiError.response?.data?.error || 'Backend synchronization failed';
        throw new Error(errorMessage);
      }

      alert('Registration successful! Please check your email for confirmation to unlock your campus portal.');
      // Redirect to OTP page
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Join Us</h1>
          <p className="auth-subtitle">Start your smart campus journey today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              name="fullName"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
