const express = require('express');
const programController = require('../controllers/programController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

router.get('/', auth, programController.list);
router.post('/', auth, requireRole('admin'), programController.create);

module.exports = router;
