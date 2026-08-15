const express = require('express');
const gradeController = require('../controllers/gradeController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

router.post('/', auth, requireRole('enseignant', 'admin'), gradeController.upsertGrade);
router.get('/etudiant/:id', auth, gradeController.forStudent);

module.exports = router;
