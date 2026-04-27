import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { AdminUser, LoginCredentials } from '@/types';

interface AuthContextType {
  admin: AdminUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = api.getAdmin();
    if (stored) {
      setAdmin(stored);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const res = await api.login(credentials);
      setAdmin({ email: res.user.email, token: res.token });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    api.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
