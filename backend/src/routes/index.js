const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const registrationRoutes = require('./registrationRoutes');
const publicRoutes = require('./publicRoutes');
const eventRoutes = require('./eventRoutes');
const galleryRoutes = require('./galleryRoutes');
const achievementRoutes = require('./achievementRoutes');
const adminRoutes = require('./adminRoutes');

router.use(authRoutes);
router.use(registrationRoutes);
router.use(publicRoutes);
router.use(eventRoutes);
router.use(galleryRoutes);
router.use(achievementRoutes);
router.use(adminRoutes);

module.exports = router;
