import axios from 'axios';

// Updated to point to our FastAPI server on port 8000
const BASE_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Changed to false to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ Attach Authorization Token for Every Request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Retrieve token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Refresh token or handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
