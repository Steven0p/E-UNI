import api from './api';

const forUser = (userId) => api.get(`/messages/${userId}`).then((res) => res.data);
const send = (data) => api.post('/messages', data).then((res) => res.data);

const messageService = { forUser, send };

export default messageService;
