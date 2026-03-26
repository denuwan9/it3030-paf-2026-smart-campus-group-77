import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      
      // Domain Restriction: Force logout if not SLIIT email
      if (currentUser?.email) {
        const email = currentUser.email.toLowerCase();
        if (!email.endsWith('@sliit.lk') && !email.endsWith('@my.sliit.lk')) {
          console.error("🛑 [Auth] Unauthorized domain detected. Forcing logout.");
          alert("Only SLIIT campus members can join this hub! Redirecting to login...");
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
      }

      setSession(session);
      setUser(currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google login error:', error.message);
      return { data: null, error };
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      // Use our backend for login to enforce is_verified and other campus logic
      const response = await authService.login(email, password);
      const { token, role } = response.data;

      // Sync with Supabase session (since our backend uses the same JWT secret)
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token, // Placeholder for flow
      });

      if (error) throw error;
      
      // Update local state with role from backend
      if (data.user) {
        data.user.user_metadata = { ...data.user.user_metadata, role };
        setUser(data.user);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return { data: null, error: error.response?.data || error };
    }
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'USER',
            ...metadata
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // Helper to get role from user metadata (assuming it's stored there)
  const getUserRole = useCallback(() => {
    return user?.user_metadata?.role || 'USER';
  }, [user]);

  const authValue = useMemo(() => ({
    user, 
    session, 
    loading, 
    loginWithGoogle, 
    signIn,
    signUp,
    logout, 
    getUserRole 
  }), [user, session, loading, loginWithGoogle, signIn, signUp, logout, getUserRole]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
