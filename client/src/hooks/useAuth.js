import { useState, useEffect, createContext, useContext } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.verifySession(token);
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user: userData } = await authService.login(credentials);
      localStorage.setItem('token', token);
      setUser(userData);
      message.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      message.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const verifyEmail = async (token) => {
    try {
      await authService.verifyEmail(token);
      message.success('Email verified successfully');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Email verification failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const socialLogin = async (provider) => {
    try {
      const { token, user: userData } = await authService.socialLogin(provider);
      localStorage.setItem('token', token);
      setUser(userData);
      message.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.message || 'Social login failed');
      throw error;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
    socialLogin,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 