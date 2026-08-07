import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  let token = window.__adminToken;
  if (!token) {
    try {
      token = sessionStorage.getItem('admin_token');
      if (token) window.__adminToken = token;
    } catch {
      // Storage unavailable
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on admin route, clear stale token
      if (error.config?.url?.includes('/admin') && !error.config?.url?.includes('/admin/login')) {
        window.__adminToken = null;
        try {
          sessionStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_username');
        } catch {
          // Ignore storage errors
        }
      }
    }
    return Promise.reject(error);
  }
);

// ========== Public API ==========

export const getPosts = () => api.get('/posts').then((res) => res.data);

export const getPost = (id) => api.get(`/posts/${id}`).then((res) => res.data);

export const submitContact = (data) =>
  api.post('/contact', data).then((res) => res.data);

// ========== Admin API ==========

export const adminLogin = (credentials) =>
  api.post('/admin/login', credentials).then((res) => res.data);

export const createPost = (data) =>
  api.post('/admin/posts', data).then((res) => res.data);

export const updatePost = (id, data) =>
  api.put(`/admin/posts/${id}`, data).then((res) => res.data);

export const reorderPosts = (orderedIds) =>
  api.put('/admin/posts/reorder', { orderedIds }).then((res) => res.data);

export const deletePost = (id) =>
  api.delete(`/admin/posts/${id}`).then((res) => res.data);

export const getMessages = () =>
  api.get('/admin/messages').then((res) => res.data);

export const checkImageSize = (url) =>
  api.get(`/images/check-size?url=${encodeURIComponent(url)}`).then((res) => res.data);

export default api;
