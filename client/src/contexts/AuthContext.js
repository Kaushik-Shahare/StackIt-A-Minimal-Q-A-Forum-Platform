"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import authService from "../services/authservice";
const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      console.log('AuthContext init: Token found, loading user');
      loadUser(token);
    } else {
      console.log('AuthContext init: No token found, skipping user load');
      setLoading(false);
    }
  }, []);
  

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      // Use real API service
      await authService.register(userData);
      setLoading(false);
      router.push('/login?registered=true');
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed');
      return false;
    }
  };

  const loadUser = async (token) => {
    try {
      const res = await authService.loadUser();
      setUser(res.user);
      setHasProfile(res.hasProfile);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      Cookies.remove('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setHasProfile(false);
      setLoading(false);
      setError(err.message || 'Authentication failed. Please log in again.');
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.login(email, password);
      Cookies.set('token', res.token, { expires: 1 });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      setHasProfile(res.hasProfile);
      setLoading(false);
      if (res.user.user_type === 'Doctor') {
        router.push('/doctor');
      } else if (res.user.user_type === 'Patient') {
        router.push('/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    authService.logout();
    setUser(null);
    router.push('/login');
  }

  const value = {
    user,
    loading,
    error,
    hasProfile,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
