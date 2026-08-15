const express = require('express');
const courseController = require('../controllers/courseController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

router.get('/', auth, courseController.list);
router.get('/etudiant/:id', auth, courseController.myCourses);
router.get('/:id', auth, courseController.getOne);
router.post('/', auth, requireRole('enseignant', 'admin'), courseController.create);
router.put('/:id', auth, requireRole('enseignant', 'admin'), courseController.update);
router.delete('/:id', auth, requireRole('enseignant', 'admin'), courseController.remove);
router.get('/:id/etudiants', auth, requireRole('enseignant', 'admin'), courseController.listStudents);
router.post('/:id/inscription', auth, requireRole('etudiant'), courseController.enroll);

module.exports = router;
