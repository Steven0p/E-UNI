const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/:userId', auth, notificationController.forUser);

module.exports = router;
