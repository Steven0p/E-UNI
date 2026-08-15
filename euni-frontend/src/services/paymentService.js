import api from './api';

const feesForStudent = (etudiantId) => api.get(`/frais/etudiant/${etudiantId}`).then((res) => res.data);
const initier = (fraisId) => api.post('/paiements/initier', { frais_id: fraisId }).then((res) => res.data);
const verifier = (reference) => api.get(`/paiements/verifier/${reference}`).then((res) => res.data);

const paymentService = { feesForStudent, initier, verifier };

export default paymentService;
