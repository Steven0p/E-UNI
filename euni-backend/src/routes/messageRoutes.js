const express = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/:userId', auth, messageController.forUser);
router.post('/', auth, messageController.send);

module.exports = router;
