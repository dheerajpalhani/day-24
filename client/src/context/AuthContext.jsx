import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('expenseUser')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('expenseToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('expenseUser', JSON.stringify(user));
      localStorage.setItem('expenseToken', token);
    } else {
      localStorage.removeItem('expenseUser');
      localStorage.removeItem('expenseToken');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    const response = await api.post('/auth/login', { email, password });
    setLoading(false);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    const response = await api.post('/auth/register', { name, email, password });
    setLoading(false);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, isAuthenticated: Boolean(user && token) }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
