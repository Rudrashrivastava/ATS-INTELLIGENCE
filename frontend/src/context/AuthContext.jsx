import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const verifyIdentity = useCallback(async (activeToken) => {
    if (!activeToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
      const res = await axios.get('/api/user/me');
      setUser(res.data);
      setToken(activeToken);
    } catch (err) {
      console.error("Identity Handshake Failed", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const activeToken = localStorage.getItem('token');
    verifyIdentity(activeToken);
  }, [verifyIdentity]);

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', credentials);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // Fetch user immediately
        const userRes = await axios.get('/api/user/me');
        setUser(userRes.data);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/register', userData);
      setSuccess(res.data.message || 'Node initialized. Please login.');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, success, login, register, logout, verifyIdentity, setError, setSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
