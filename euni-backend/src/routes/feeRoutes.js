const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/etudiant/:id', auth, paymentController.listFeesForStudent);

module.exports = router;
