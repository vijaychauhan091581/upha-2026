const express = require('express');
const router = express.Router();
const PublicController = require('../controllers/publicController');
const SettingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/authMiddleware');

// Public listing
router.get(['/office-bearers', '/office-bearers/'], PublicController.listOfficeBearers);
router.get(['/stats', '/stats/'], PublicController.getGlobalStats);
router.get(['/players', '/players/'], PublicController.listPlayers);
router.get(['/coaches', '/coaches/'], PublicController.listCoaches);
router.get(['/referees', '/referees/'], PublicController.listReferees);
router.get(['/academies', '/academies/'], PublicController.listAcademies);
router.get(['/districts', '/districts/'], PublicController.listDistricts);
router.get(['/districts/:id', '/districts/:id/'], PublicController.getDistrict);
router.get(['/referee-stats', '/referee-stats/'], PublicController.getRefereeStats);
router.get(['/district-stats', '/district-stats/'], PublicController.getDistrictStats);
router.get(['/search/player', '/search/player/'], PublicController.searchPlayers);
router.get(['/announcements', '/announcements/'], PublicController.listAnnouncements);
router.get(['/agm-letters', '/agm-letters/'], PublicController.listAgmLetters);
router.get(['/upha-forms', '/upha-forms/'], PublicController.listUphaForms);
router.get(['/settings', '/settings/'], SettingsController.getSettings);
router.post(['/contact', '/contact/'], PublicController.submitContact);

// Authenticated member routes
router.get(['/notifications', '/notifications/'], authenticate(true), PublicController.getNotifications);
router.post(['/notifications/:notif_id/read', '/notifications/:notif_id/read/'], authenticate(true), PublicController.markNotificationRead);
router.get(['/me/certificates', '/me/certificates/'], authenticate(true), PublicController.getMyCertificates);
router.get(['/me/assignments', '/me/assignments/'], authenticate(true), PublicController.getMyAssignments);

module.exports = router;
