import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    currentUser: null,
    isAdmin: false,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(response => {
          setAuthState({
            currentUser: response.data,
            isAdmin: response.data.role === 'admin',
            isAuthenticated: true,
            loading: false,
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setAuthState({
            currentUser: null,
            isAdmin: false,
            isAuthenticated: false,
            loading: false,
          });
        });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        // Fetch user info after login
        const userResponse = await api.get('/auth/me');
        setAuthState({
          currentUser: userResponse.data,
          isAdmin: userResponse.data.role === 'admin',
          isAuthenticated: true,
          loading: false,
        });
        // Redirect based on role
        if (userResponse.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setAuthState({
      currentUser: null,
      isAdmin: false,
      isAuthenticated: false,
      loading: false,
    });
    navigate('/login');
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
