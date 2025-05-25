import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supbase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Map Supabase user to a compatible User type
export type User = SupabaseUser;

type AuthContextType = {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  checkAuthState: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const signup = async (email: string, password: string) => {
    clearError();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Signup failed');
      throw signUpError || new Error('Signup failed');
    }
    setCurrentUser(data.user);
    return data.user;
  };

  const login = async (email: string, password: string) => {
    clearError();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !data.user) {
      setError(signInError?.message || 'Login failed');
      throw signInError || new Error('Login failed');
    }
    setCurrentUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    clearError();
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      throw signOutError;
    }
    setCurrentUser(null);
  };

  const checkAuthState = useCallback(() => {
    setLoading(true);
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });
    // Return unsubscribe function
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = checkAuthState();
    return unsubscribe;
  }, [checkAuthState]);

  const value = {
    currentUser,
    signup,
    login,
    signOut,
    loading,
    error,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}