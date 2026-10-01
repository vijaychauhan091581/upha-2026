const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public Auth
router.post(['/login', '/login/'], AuthController.login);
router.post(['/logout', '/logout/'], AuthController.logout);
router.post(['/register/admin', '/register/admin/'], AuthController.registerAdmin);

// Protected Auth
router.get(['/me', '/me/'], authenticate(false), AuthController.me);
router.post(['/update-credentials', '/update-credentials/'], authenticate(true), AuthController.updateCredentials);
router.post(['/invite-admin', '/invite-admin/'], authenticate(true), requireAdmin, AuthController.inviteAdmin);

module.exports = router;
