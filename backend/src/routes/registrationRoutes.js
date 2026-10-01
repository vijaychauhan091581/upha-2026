const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/registrationController');
const { createUploader } = require('../middleware/uploadMiddleware');

const playerUpload = createUploader('player_uploads').any();
const coachUpload = createUploader('coach_uploads').any();
const refereeUpload = createUploader('referee_uploads').any();
const academyUpload = createUploader('academy_uploads').any();
const districtUpload = createUploader('district_uploads').any();

router.post(['/register/player', '/register/player/'], playerUpload, RegistrationController.registerPlayer);
router.post(['/register/coach', '/register/coach/'], coachUpload, RegistrationController.registerCoach);
router.post(['/register/referee', '/register/referee/'], refereeUpload, RegistrationController.registerReferee);
router.post(['/register/academy', '/register/academy/'], academyUpload, RegistrationController.registerAcademy);
router.post(['/register/district', '/register/district/'], districtUpload, RegistrationController.registerDistrict);

module.exports = router;
