import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && config && !config._retry) {
      config._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return Promise.reject(error);

      try {
        refreshing = refreshing || axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        const { data } = await refreshing;
        refreshing = null;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(config);
      } catch (refreshError) {
        refreshing = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/connexion';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
