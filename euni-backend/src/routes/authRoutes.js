const express = require('express');
const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, authController.registerValidators, authController.register);
router.post('/login', authLimiter, authController.loginValidators, authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authController.logout);
router.post(
  '/forgot-password',
  authLimiter,
  authController.forgotPasswordValidators,
  authController.forgotPassword,
);
router.post('/reset-password', authLimiter, authController.resetPasswordValidators, authController.resetPassword);

module.exports = router;
