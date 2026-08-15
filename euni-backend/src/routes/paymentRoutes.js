const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

router.post('/initier', auth, requireRole('etudiant'), paymentController.initierPaiement);
router.get('/verifier/:reference', auth, paymentController.verifierPaiement);
router.post('/webhook', paymentController.webhook);
router.post('/manuel', auth, requireRole('admin'), paymentController.payerManuellement);

module.exports = router;
