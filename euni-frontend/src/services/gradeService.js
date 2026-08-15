import api from './api';

const evaluationsForCourse = (coursId) => api.get(`/evaluations/cours/${coursId}`).then((res) => res.data);
const createEvaluation = (data) => api.post('/evaluations', data).then((res) => res.data);
const upsertGrade = (data) => api.post('/notes', data).then((res) => res.data);
const releveForStudent = (etudiantId) => api.get(`/notes/etudiant/${etudiantId}`).then((res) => res.data);

const gradeService = { evaluationsForCourse, createEvaluation, upsertGrade, releveForStudent };

export default gradeService;
