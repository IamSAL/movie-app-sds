import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';


interface MockUser {
  email: string;
}

type AuthContextType = {
  currentUser: MockUser | null;
  signup: (email: string, password: string) => Promise<MockUser>;
  login: (email: string, password: string) => Promise<MockUser>;
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

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const DEMO_EMAIL = 'demo@example.com';
  const DEMO_PASSWORD = 'password123';

  const signup = async (email: string, password: string) => {
    clearError();
  
    if (email === DEMO_EMAIL) {
      setCookie('mock_auth', DEMO_EMAIL);
      const user = { email: DEMO_EMAIL };
      setCurrentUser(user);
      return user;
    }


    const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
    if (users[email]) {
      setError('User already exists');
      throw new Error('User already exists');
    }
    users[email] = { email, password };
    localStorage.setItem('mock_users', JSON.stringify(users));
    setCookie('mock_auth', email);
    const user = { email };
    setCurrentUser(user);
    return user;
  };

  const login = async (email: string, password: string) => {
    clearError();
    // Allow demo user to always login
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setCookie('mock_auth', DEMO_EMAIL);
      const user = { email: DEMO_EMAIL };
      setCurrentUser(user);
      return user;
    }
    const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
    if (!users[email] || users[email].password !== password) {
      setError('Invalid credentials');
      throw new Error('Invalid credentials');
    }
    setCookie('mock_auth', email);
    const user = { email };
    setCurrentUser(user);
    return user;
  };

  const signOut = async () => {
    clearError();
    deleteCookie('mock_auth');
    setCurrentUser(null);
  };

  const checkAuthState = useCallback(() => {
    setLoading(true);
    const email = getCookie('mock_auth');
    if (email) {
      setCurrentUser({ email });
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthState();
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