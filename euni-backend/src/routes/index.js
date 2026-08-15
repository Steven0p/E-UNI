const express = require('express');

const authRoutes = require('./authRoutes');
const programRoutes = require('./programRoutes');
const courseRoutes = require('./courseRoutes');
const evaluationRoutes = require('./evaluationRoutes');
const gradeRoutes = require('./gradeRoutes');
const feeRoutes = require('./feeRoutes');
const paymentRoutes = require('./paymentRoutes');
const messageRoutes = require('./messageRoutes');
const notificationRoutes = require('./notificationRoutes');
const resourceRoutes = require('./resourceRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/programmes', programRoutes);
router.use('/cours', courseRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/notes', gradeRoutes);
router.use('/frais', feeRoutes);
router.use('/paiements', paymentRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ressources', resourceRoutes);

module.exports = router;
