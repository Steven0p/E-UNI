import api from './api';

const forUser = (userId) => api.get(`/notifications/${userId}`).then((res) => res.data);

const notificationService = { forUser };

export default notificationService;
