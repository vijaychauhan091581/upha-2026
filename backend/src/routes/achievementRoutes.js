const express = require('express');
const router = express.Router();
const AchievementController = require('../controllers/achievementController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { createUploader } = require('../middleware/uploadMiddleware');

const achievementUpload = createUploader('achievements').any();

// Public Achievements
router.get(['/achievements', '/achievements/'], AchievementController.listAchievements);

// Admin Achievements Management
router.all(['/admin/achievements/medals', '/admin/achievements/medals/'], authenticate(true), requireAdmin, AchievementController.manageMedals);
router.all(['/admin/achievements/players', '/admin/achievements/players/'], authenticate(true), requireAdmin, achievementUpload, AchievementController.managePlayers);
router.all(['/admin/achievements/coaches', '/admin/achievements/coaches/'], authenticate(true), requireAdmin, achievementUpload, AchievementController.manageCoaches);
router.all(['/admin/achievements/awards', '/admin/achievements/awards/'], authenticate(true), requireAdmin, achievementUpload, AchievementController.manageAwards);

module.exports = router;
