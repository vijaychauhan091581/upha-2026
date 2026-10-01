const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { createUploader } = require('../middleware/uploadMiddleware');

const scoresheetUpload = createUploader('scoresheets').single('scoresheet');
const eventImageUpload = createUploader('events').single('image');

// Public Event Routes
router.get(['/events', '/events/'], EventController.listEvents);
router.get(['/event-years', '/event-years/'], EventController.listEventYears);
router.get(['/event-results', '/event-results/'], EventController.listEventResults);

// Admin Event Routes
router.post(['/admin/events/create', '/admin/events/create/'], authenticate(true), requireAdmin, eventImageUpload, EventController.createEvent);
router.post(['/admin/events/:event_id/update', '/admin/events/:event_id/update/'], authenticate(true), requireAdmin, eventImageUpload, EventController.updateEvent);
router.put(['/admin/events/:event_id', '/admin/events/:event_id/'], authenticate(true), requireAdmin, eventImageUpload, EventController.updateEvent);
router.delete(['/admin/events/:event_id/delete', '/admin/events/:event_id/delete/'], authenticate(true), requireAdmin, EventController.deleteEvent);
router.post(['/admin/events/:event_id/results', '/admin/events/:event_id/results/'], authenticate(true), requireAdmin, EventController.addEventResult);
router.delete(['/admin/events/:event_id/results/:result_id/delete', '/admin/events/:event_id/results/:result_id/delete/'], authenticate(true), requireAdmin, EventController.deleteEventResult);
router.post(['/admin/events/:event_id/upload-results', '/admin/events/:event_id/upload-results/'], authenticate(true), requireAdmin, scoresheetUpload, EventController.uploadTournamentResults);
router.delete(['/admin/events/:event_id/upload-results/delete', '/admin/events/:event_id/upload-results/delete/'], authenticate(true), requireAdmin, EventController.deleteTournamentResult);
router.get(['/admin/events/participants', '/admin/events/participants/'], authenticate(true), requireAdmin, EventController.getParticipantsForCertificates);
router.post(['/admin/events/:event_id/issue-certificates', '/admin/events/:event_id/issue-certificates/'], authenticate(true), requireAdmin, EventController.issueCertificates);

module.exports = router;
