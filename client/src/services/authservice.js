import api from './Apiservices';
import * as apiServices from './Apiservices';
import Cookies from 'js-cookie';

// Authentication service for interacting with the backend
const authService = {
  // Register a new user
  async register(userData) {
    try {
      const { email, password, user_type = 'User' } = userData;
      
      const requestData = {
        email,
        password,
        user_type
      };
      
      const response = await apiServices.register(requestData);
      
      // Return formatted response
      return {
        success: response.success || response.status,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await apiServices.login({ email, password });
      console.log("Login response:", response);
      
      // Extract tokens and user data from backend response format
      const { access, refresh, user } = response.data || response;
      
      // Save tokens
      if (access) {
        localStorage.setItem('accesstoken', access);
        Cookies.set('token', access, { expires: 7 }); // 7 days
      }
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      
      // Return user data and tokens
      return {
        user,
        token: access,
        refreshToken: refresh,
        hasProfile: !!user?.profile,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      await apiServices.logout();
      
      // Clear local storage and cookies
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('refreshToken');
      Cookies.remove('token');
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage and cookies even if API call fails
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('refreshToken');
      Cookies.remove('token');
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiServices.forgotPassword(email);
      return {
        success: true,
        message: response.message || 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiServices.getProfile();
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiServices.updateProfile(profileData);
      return {
        success: true,
        message: 'Profile updated successfully',
        data: response
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Load authenticated user's data
  async loadUser() {
    try {
      const response = await this.getProfile();
      const userData = response.data || response;
      
      return {
        user: userData,
        hasProfile: !!userData.profile,
      };
    } catch (error) {
      console.error('Load user error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('accesstoken') || Cookies.get('token');
    return !!token;
  },

  // Get current token
  getToken() {
    return localStorage.getItem('accesstoken') || Cookies.get('token');
  },

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },

  // Clear all authentication data
  clearAuth() {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshToken');
    Cookies.remove('token');
  }
};

export default authService;
