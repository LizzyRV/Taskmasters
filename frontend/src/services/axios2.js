import axios from 'axios';

const axios2 = axios.create({
  baseURL: 'https://taskmasters-f3b4.onrender.com/api/',
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

    // Manejo de error 401 (no autorizado) y refresco del token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Si no hay refresh token, redirigir al login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
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
    } else if (error.response && (error.response.status === 400 || error.response.status === 404)) {
      // Si es un error de autenticación o página no encontrada, limpiar tokens y redirigir al login
      console.error('Error de autenticación o recurso no encontrado.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axios2;
