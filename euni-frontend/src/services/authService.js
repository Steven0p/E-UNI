import api from './api';

const register = (data) => api.post('/auth/register', data).then((res) => res.data);
const login = (data) => api.post('/auth/login', data).then((res) => res.data);
const refresh = (refreshToken) => api.post('/auth/refresh', { refreshToken }).then((res) => res.data);
const logout = (refreshToken) => api.post('/auth/logout', { refreshToken }).then((res) => res.data);
const forgotPassword = (email) => api.post('/auth/forgot-password', { email }).then((res) => res.data);
const resetPassword = (data) => api.post('/auth/reset-password', data).then((res) => res.data);

const authService = { register, login, refresh, logout, forgotPassword, resetPassword };

export default authService;
