import api from './api';

const list = (params) => api.get('/ressources', { params }).then((res) => res.data);
const create = (data) => api.post('/ressources', data).then((res) => res.data);

const resourceService = { list, create };

export default resourceService;
