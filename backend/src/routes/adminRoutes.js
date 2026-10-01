const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const SettingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { createUploader } = require('../middleware/uploadMiddleware');

const certUpload = createUploader('certificates').any();
const obUpload = createUploader('office_bearers').any();
const formUpload = createUploader('forms').any();
const agmUpload = createUploader('agm').any();
const settingsUpload = createUploader('settings').any();
const memberUpload = createUploader('members').any();

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

// Enquiries / Contact Messages
router.get(['/admin/enquiries', '/admin/enquiries/'], AdminController.listEnquiries);
router.patch(['/admin/enquiries/:id', '/admin/enquiries/:id/'], AdminController.updateEnquiryStatus);
router.post(['/admin/enquiries/:id/status', '/admin/enquiries/:id/status/'], AdminController.updateEnquiryStatus);
router.delete(['/admin/enquiries/:id', '/admin/enquiries/:id/'], AdminController.deleteEnquiry);

// Bulk Import
router.post(['/admin/import/players', '/admin/import/players/'], AdminController.importPlayers);
router.post(['/admin/import/coaches', '/admin/import/coaches/'], AdminController.importCoaches);

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
