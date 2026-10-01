const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const SettingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { createUploader } = require('../middleware/uploadMiddleware');

const certUpload = createUploader('certificates').single('certificate');
const obUpload = createUploader('office_bearers').single('image');
const formUpload = createUploader('forms').single('file');
const agmUpload = createUploader('agm').single('file');
const settingsUpload = createUploader('settings').fields([
  { name: 'payment_qr_code', maxCount: 1 },
  { name: 'hai_affiliation_letter', maxCount: 1 },
  { name: 'up_olympic_letter', maxCount: 1 },
]);

const memberUpload = createUploader('members').fields([
  { name: 'image', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'passport_image', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]);

// Protect all admin routes
router.use(authenticate(true), requireAdmin);

// Admin Stats & Audit Logs
router.get(['/admin/stats', '/admin/stats/'], AdminController.getAdminStats);
router.get(['/admin/decisions', '/admin/decisions/'], AdminController.getRecentDecisions);

// Payment Approval / Rejection & Bulk Actions
router.post(['/admin/registrations/bulk-approve', '/admin/registrations/bulk-approve/'], AdminController.bulkApprove);
router.post(['/admin/reject', '/admin/reject/'], AdminController.rejectApplication);

// Quick Add Coach & Referee by Admin
router.post(['/admin/coaches/create', '/admin/coaches/create/'], memberUpload, AdminController.createCoach);
router.post(['/admin/referees/create', '/admin/referees/create/'], memberUpload, AdminController.createReferee);

// Certificates & Players Search
router.post(['/admin/players/:player_id/certificate', '/admin/players/:player_id/certificate/'], certUpload, AdminController.uploadPlayerCertificate);
router.get(['/admin/players/search', '/admin/players/search/'], AdminController.searchPlayersForCert);

// System Settings
router.all(['/admin/settings', '/admin/settings/'], settingsUpload, SettingsController.updateSettings);

// Office Bearers
router.all(['/admin/office-bearers', '/admin/office-bearers/'], obUpload, AdminController.manageOfficeBearers);

// Announcements (Placed BEFORE wildcard /admin/:type/:id routes)
router.post(['/admin/announcements/create', '/admin/announcements/create/'], AdminController.createAnnouncement);
router.put(['/admin/announcements/:id', '/admin/announcements/:id/'], AdminController.updateAnnouncement);
router.delete(['/admin/announcements/:id', '/admin/announcements/:id/'], AdminController.deleteAnnouncement);

// AGM Letters & Forms
router.post(['/admin/agm-letters', '/admin/agm-letters/'], agmUpload, AdminController.createAgmLetter);
router.delete(['/admin/agm-letters/:letter_id/delete', '/admin/agm-letters/:letter_id/delete/'], AdminController.deleteAgmLetter);

router.post(['/admin/upha-forms/create', '/admin/upha-forms/create/'], formUpload, AdminController.createUphaForm);
router.delete(['/admin/upha-forms/:form_id/delete', '/admin/upha-forms/:form_id/delete/'], AdminController.deleteUphaForm);

// Generic Registration Routes (Players, Referees, Coaches, Academies, Districts) - placed last to prevent shadowing specific routes
router.post(['/admin/:type/:id/payment', '/admin/:type/:id/payment/'], AdminController.updatePaymentStatus);
router.post(['/admin/:type/:id/update', '/admin/:type/:id/update/'], memberUpload, AdminController.updateRegistration);
router.post(['/admin/:type/:id/remove-photo', '/admin/:type/:id/remove-photo/'], AdminController.removePhoto);
router.put(['/admin/:type/:id', '/admin/:type/:id/'], memberUpload, AdminController.updateRegistration);
router.delete(['/admin/:type/:id', '/admin/:type/:id/delete', '/admin/:type/:id/delete/'], AdminController.deleteRegistration);
router.post(['/admin/:type/:id/delete', '/admin/:type/:id/delete/'], AdminController.deleteRegistration);

module.exports = router;
