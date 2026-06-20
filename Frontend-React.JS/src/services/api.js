import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true, // Send session cookies/tokens automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
