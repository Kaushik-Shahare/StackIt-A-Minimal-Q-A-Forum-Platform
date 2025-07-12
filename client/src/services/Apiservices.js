import axios from 'axios';
import Cookies from 'js-cookie';

// Use the backend URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <-- Important for sending cookies
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from cookie first, then fallback to localStorage

    // Get token from localStorage first, then fallback to cookies for consistency
    const token = localStorage.getItem('accesstoken') || Cookies.get('token');
    
    // Log for debugging purposes (remove in production)
    console.log(`API Request to: ${config.url}`);
    console.log(`Token available: ${!!token}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`API Success Response from: ${response.config.url}`, {
      status: response.status,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      hasData: response.data && typeof response.data === 'object' ? 'data' in response.data : false,
      keys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : []
    });
    return response;
  },
  (error) => {
    console.error(`API Error Response: ${error.config?.url || 'unknown endpoint'}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);


// ===== AUTHENTICATION APIs =====
export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error.response?.data || { message: 'Failed to register user' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response?.data || { message: 'Failed to login' };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout/');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error.response?.data || { message: 'Failed to logout' };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/auth/forgot-password/', { email });
    return response.data;
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    throw error.response?.data || { message: 'Failed to send forgot password email' };
  }
};

// ===== PROFILE MANAGEMENT APIs =====
export const getProfile = async () => {
  try {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/api/auth/profile/', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// ===== QUESTIONS APIs =====
export const getQuestions = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/api/forum/questions/?${queryParams}` : '/api/forum/questions/';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error.response?.data || { message: 'Failed to fetch questions' };
  }
};

export const createQuestion = async (questionData) => {
  try {
    const response = await api.post('/api/forum/questions/', questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error.response?.data || { message: 'Failed to create question' };
  }
};

export const getQuestionDetail = async (slug) => {
  try {
    const response = await api.get(`/api/forum/questions/${slug}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question detail:', error);
    throw error.response?.data || { message: 'Failed to fetch question detail' };
  }
};

export const updateQuestion = async (slug, questionData) => {
  try {
    const response = await api.put(`/api/forum/questions/${slug}/`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error.response?.data || { message: 'Failed to update question' };
  }
};

export const deleteQuestion = async (slug) => {
  try {
    const response = await api.delete(`/api/forum/questions/${slug}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error.response?.data || { message: 'Failed to delete question' };
  }
};

export const upvoteQuestion = async (slug) => {
  try {
    const response = await api.post(`/api/forum/questions/${slug}/upvote/`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting question:', error);
    throw error.response?.data || { message: 'Failed to upvote question' };
  }
};

export const downvoteQuestion = async (slug) => {
  try {
    const response = await api.post(`/api/forum/questions/${slug}/downvote/`);
    return response.data;
  } catch (error) {
    console.error('Error downvoting question:', error);
    throw error.response?.data || { message: 'Failed to downvote question' };
  }
};

// ===== ANSWERS APIs =====
export const getAnswers = async (questionSlug) => {
  try {
    const response = await api.get(`/api/forum/questions/${questionSlug}/answers/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching answers:', error);
    throw error.response?.data || { message: 'Failed to fetch answers' };
  }
};

export const postAnswer = async (questionSlug, answerData) => {
  try {
    const response = await api.post(`/api/forum/questions/${questionSlug}/answers/`, answerData);
    return response.data;
  } catch (error) {
    console.error('Error posting answer:', error);
    throw error.response?.data || { message: 'Failed to post answer' };
  }
};

export const updateAnswer = async (questionSlug, answerId, answerData) => {
  try {
    const response = await api.put(`/api/forum/questions/${questionSlug}/answers/${answerId}/`, answerData);
    return response.data;
  } catch (error) {
    console.error('Error updating answer:', error);
    throw error.response?.data || { message: 'Failed to update answer' };
  }
};

export const deleteAnswer = async (questionSlug, answerId) => {
  try {
    const response = await api.delete(`/api/forum/questions/${questionSlug}/answers/${answerId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting answer:', error);
    throw error.response?.data || { message: 'Failed to delete answer' };
  }
};

export const acceptAnswer = async (questionSlug, answerId) => {
  try {
    const response = await api.post(`/api/forum/questions/${questionSlug}/answers/${answerId}/accept/`);
    return response.data;
  } catch (error) {
    console.error('Error accepting answer:', error);
    throw error.response?.data || { message: 'Failed to accept answer' };
  }
};

export const upvoteAnswer = async (questionSlug, answerId) => {
  try {
    const response = await api.post(`/api/forum/questions/${questionSlug}/answers/${answerId}/upvote/`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting answer:', error);
    throw error.response?.data || { message: 'Failed to upvote answer' };
  }
};

export const downvoteAnswer = async (questionSlug, answerId) => {
  try {
    const response = await api.post(`/api/forum/questions/${questionSlug}/answers/${answerId}/downvote/`);
    return response.data;
  } catch (error) {
    console.error('Error downvoting answer:', error);
    throw error.response?.data || { message: 'Failed to downvote answer' };
  }
};

// ===== COMMENTS APIs =====
export const getComments = async (questionSlug, answerId) => {
  try {
    const response = await api.get(`/api/forum/questions/${questionSlug}/answers/${answerId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error.response?.data || { message: 'Failed to fetch comments' };
  }
};

export const postComment = async (questionSlug, answerId, commentData) => {
  try {
    const response = await api.post(`/api/forum/questions/${questionSlug}/answers/${answerId}/comments/`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error.response?.data || { message: 'Failed to post comment' };
  }
};

export const updateComment = async (questionSlug, answerId, commentId, commentData) => {
  try {
    const response = await api.put(`/api/forum/questions/${questionSlug}/answers/${answerId}/comments/${commentId}/`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error.response?.data || { message: 'Failed to update comment' };
  }
};

export const deleteComment = async (questionSlug, answerId, commentId) => {
  try {
    const response = await api.delete(`/api/forum/questions/${questionSlug}/answers/${answerId}/comments/${commentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error.response?.data || { message: 'Failed to delete comment' };
  }
};

// ===== TAGS APIs =====
export const getTags = async () => {
  try {
    const response = await api.get('/api/forum/tags/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error.response?.data || { message: 'Failed to fetch tags' };
  }
};

export const getTagDetail = async (slug) => {
  try {
    const response = await api.get(`/api/forum/tags/${slug}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tag detail:', error);
    throw error.response?.data || { message: 'Failed to fetch tag detail' };
  }
};

export const createTag = async (tagData) => {
  try {
    const response = await api.post('/api/forum/tags/', tagData);
    return response.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error.response?.data || { message: 'Failed to create tag' };
  }
};

// ===== NOTIFICATIONS APIs =====
export const getNotifications = async () => {
  try {
    const response = await api.get('/api/forum/notifications/');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get('/api/forum/notifications/unread_count/');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error.response?.data || { message: 'Failed to fetch unread notification count' };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/api/forum/notifications/${notificationId}/mark_as_read/`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error.response?.data || { message: 'Failed to mark notification as read' };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/api/forum/notifications/mark_all_as_read/');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error.response?.data || { message: 'Failed to mark all notifications as read' };
  }
};

export default api;
