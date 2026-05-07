import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Stories
export const fetchStories = (page = 1, limit = 10) =>
  api.get(`/stories?page=${page}&limit=${limit}`);
export const fetchStoryById = (id) => api.get(`/stories/${id}`);
export const toggleBookmark = (id) => api.post(`/stories/${id}/bookmark`);

// Scraper
export const triggerScrape = () => api.post('/scrape');

export default api;
