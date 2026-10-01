const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/registrationController');
const { createUploader } = require('../middleware/uploadMiddleware');

const playerUpload = createUploader('player_uploads').fields([
  { name: 'adhar_image', maxCount: 1 },
  { name: 'aadhar_image', maxCount: 1 },
  { name: 'adhar_card', maxCount: 1 },
  { name: 'aadhar_card_scan', maxCount: 1 },
  { name: 'passport_image', maxCount: 1 },
  { name: 'passport_photo', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'transaction_image', maxCount: 1 },
  { name: 'certificate_image', maxCount: 1 },
]);

const coachUpload = createUploader('coach_uploads').fields([
  { name: 'adhar_image', maxCount: 1 },
  { name: 'passport_image', maxCount: 1 },
  { name: 'transaction_image', maxCount: 1 },
]);

const refereeUpload = createUploader('referee_uploads').fields([
  { name: 'adhar_image', maxCount: 1 },
  { name: 'passport_image', maxCount: 1 },
  { name: 'transaction_image', maxCount: 1 },
]);

const academyUpload = createUploader('academy_uploads').fields([
  { name: 'logo', maxCount: 1 },
  { name: 'registration_certificate', maxCount: 1 },
  { name: 'address_proof', maxCount: 1 },
  { name: 'transaction_image', maxCount: 1 },
  { name: 'facility_photos', maxCount: 10 },
]);

const districtUpload = createUploader('district_uploads').any();

router.post(['/register/player', '/register/player/'], playerUpload, RegistrationController.registerPlayer);
router.post(['/register/coach', '/register/coach/'], coachUpload, RegistrationController.registerCoach);
router.post(['/register/referee', '/register/referee/'], refereeUpload, RegistrationController.registerReferee);
router.post(['/register/academy', '/register/academy/'], academyUpload, RegistrationController.registerAcademy);
router.post(['/register/district', '/register/district/'], districtUpload, RegistrationController.registerDistrict);

module.exports = router;
