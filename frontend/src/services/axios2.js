import axios from 'axios';

const axios2 = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

axios2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios2.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios2.post('token/refresh/', { refresh: refreshToken });
        localStorage.setItem('access_token', response.data.access);
  
        axios2.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return axios2(originalRequest);
      } catch (refreshError) {
        console.error('No se pudo refrescar el token', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios2;