import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  // FORCE RE-READ FROM STORAGE
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. SYNC TOKEN WITH STORAGE CHANGES
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  // 2. IDENTITY VERIFICATION (Deep Handshake)
  useEffect(() => {
    const verifyIdentity = async () => {
      const activeToken = localStorage.getItem('token');
      if (!activeToken) {
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
        const res = await axios.get('/api/user/me');
        setUser(res.data);
        setToken(activeToken); // Ensure state matches storage
      } catch (err) {
        console.error("Identity Handshake Failed", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyIdentity();
  }, []); // Run ONCE on mount to sync reality

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', credentials);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
    return false;
  }, []);

  const handleRegister = useCallback(async (userData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/register', userData);
      setSuccess(res.data.message || 'Node initialized. Please login.');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  return { token, user, loading, error, success, handleLogin, handleRegister, logout, setError, setSuccess };
};
