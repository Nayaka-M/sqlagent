import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API_URL = 'https://sql-query-agent-backend.onrender.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      setUser(res.data);
    } catch (error) {
      console.error('Fetch user error:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { access_token, user } = res.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setToken(access_token);
      setUser(user);
      
      toast.success('Welcome back! 🎉');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
      return { success: false };
    }
  };

  const register = async (username, email, password, full_name) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, email, password, full_name });
      toast.success('Account created! Please login. 🎉');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}