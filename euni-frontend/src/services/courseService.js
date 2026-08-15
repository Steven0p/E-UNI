import api from './api';

const list = (programmeId) => api.get('/cours', { params: { programme_id: programmeId } }).then((res) => res.data);
const getOne = (id) => api.get(`/cours/${id}`).then((res) => res.data);
const create = (data) => api.post('/cours', data).then((res) => res.data);
const update = (id, data) => api.put(`/cours/${id}`, data).then((res) => res.data);
const remove = (id) => api.delete(`/cours/${id}`).then((res) => res.data);
const listStudents = (id) => api.get(`/cours/${id}/etudiants`).then((res) => res.data);
const enroll = (id) => api.post(`/cours/${id}/inscription`).then((res) => res.data);
const myCourses = (etudiantId) => api.get(`/cours/etudiant/${etudiantId}`).then((res) => res.data);
const listProgrammes = () => api.get('/programmes').then((res) => res.data);

const courseService = { list, getOne, create, update, remove, listStudents, enroll, myCourses, listProgrammes };

export default courseService;
