const express = require('express');
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

router.get('/cours/:coursId', auth, evaluationController.listForCourse);
router.post('/', auth, requireRole('enseignant', 'admin'), evaluationController.create);

module.exports = router;
