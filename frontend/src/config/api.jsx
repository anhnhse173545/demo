import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // replace with your backend API URL
  timeout: 5000, // request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor if you need authorization tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // handle unauthorized errors
      console.log("Unauthorized access - redirecting to login");
      // handle redirect, logout, etc.
    }
    return Promise.reject(error);
  }
);

export default api;
