const express = require('express');
const resourceController = require('../controllers/resourceController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, resourceController.list);
router.post('/', auth, resourceController.create);

module.exports = router;
