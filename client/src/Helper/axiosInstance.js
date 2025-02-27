import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Keeps cookies for authentication
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
  },
);

export default axiosInstance;
