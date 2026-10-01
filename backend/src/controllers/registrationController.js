const path = require('path');
const db = require('../config/database');
const { MEDIA_ROOT } = require('../config/constants');
const UserModel = require('../models/UserModel');
const PlayerModel = require('../models/PlayerModel');
const CoachModel = require('../models/CoachModel');
const RefereeModel = require('../models/RefereeModel');
const AcademyModel = require('../models/AcademyModel');
const DistrictModel = require('../models/DistrictModel');
const { hashPassword } = require('../utils/passwordUtils');


function getRelativePath(file) {
  if (!file || !file.path) return null;
  return path.relative(MEDIA_ROOT, file.path).replace(/\\/g, '/');
}

function getFilesMap(req) {
  const map = {};
  if (Array.isArray(req.files)) {
    for (const f of req.files) {
      if (!map[f.fieldname]) map[f.fieldname] = [];
      map[f.fieldname].push(f);
    }
  } else if (req.files && typeof req.files === 'object') {
    for (const [k, v] of Object.entries(req.files)) {
      map[k] = Array.isArray(v) ? v : [v];
    }
  }
  return map;
}

class RegistrationController {
  static async registerPlayer(req, res) {
    try {
      const b = req.body;
      const files = getFilesMap(req);

      if (!b.email || !b.password || !b.name) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }

      const adhar_image = (files.adhar_image || files.aadhar_image || files.adhar_card || files.aadhar_card_scan)
        ? getRelativePath((files.adhar_image || files.aadhar_image || files.adhar_card || files.aadhar_card_scan)[0])
        : null;
      const passport_image = (files.passport_image || files.passport_photo || files.photo)
        ? getRelativePath((files.passport_image || files.passport_photo || files.photo)[0])
        : null;
      const transaction_image = files.transaction_image ? getRelativePath(files.transaction_image[0]) : (b.transaction_image || '');
      const certificate_image = files.certificate_image ? getRelativePath(files.certificate_image[0]) : null;

      const adhar_number = (b.adhar_number || b.aadhar_number || b.adhar || b.aadhar || '').trim();

      const user = UserModel.create({
        username: b.username || `${b.email.trim()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email: b.email.trim(),
        password: hashPassword(b.password),
        name: b.name,
        role: 'player',
        phone_number: b.phone_number || '',
        gender: b.gender || '',
        father_name: b.father_name || '',
        mother_name: b.mother_name || '',
        blood_group: b.blood_group || '',
        date_of_birth: b.date_of_birth || null,
        adhar_number,
        adhar_image,
        passport_image,
      });

      const player = PlayerModel.create({
        user_id: user.id,
        district: b.district || '',
        dominant_hand: b.dominant_hand || '',
        club_name: b.club_name || '',
        school_name: b.school_name || '',
        coach_name: b.coach_name || '',
        height: b.height || 0,
        weight: b.weight || 0,
        transaction_id: b.transaction_id || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        transaction_image: transaction_image || '',
        paid: 0,
        certificate_image,
      });

      const formatted = PlayerModel.formatPlayer(player, user, req);
      return res.status(201).json({
        success: true,
        message: 'Player registered successfully. Pending approval.',
        player: formatted,
      });
    } catch (err) {
      console.error('Register player error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Player registration failed.' });
    }
  }

  static async registerCoach(req, res) {
    try {
      const b = req.body;
      const files = getFilesMap(req);

      if (!b.email || !b.password || !b.name) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }

      const adhar_image = (files.adhar_image || files.aadhar_image || files.adhar_card)
        ? getRelativePath((files.adhar_image || files.aadhar_image || files.adhar_card)[0])
        : null;
      const passport_image = (files.passport_image || files.passport_photo || files.photo)
        ? getRelativePath((files.passport_image || files.passport_photo || files.photo)[0])
        : null;
      const transaction_image = files.transaction_image ? getRelativePath(files.transaction_image[0]) : (b.transaction_image || '');
      const certificate_image = files.certificate_image ? getRelativePath(files.certificate_image[0]) : null;

      const user = UserModel.create({
        username: b.username || `${b.email.trim()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email: b.email.trim(),
        password: hashPassword(b.password),
        name: b.name,
        role: 'coach',
        phone_number: b.phone_number || '',
        gender: b.gender || '',
        father_name: b.father_name || '',
        mother_name: b.mother_name || '',
        blood_group: b.blood_group || '',
        date_of_birth: b.date_of_birth || null,
        adhar_number: b.adhar_number || '',
        adhar_image,
        passport_image,
      });

      const coach = CoachModel.create({
        user_id: user.id,
        district: b.district || '',
        occupation: b.occupation || '',
        highest_coaching_grade: b.highest_coaching_grade || '',
        transaction_id: b.transaction_id || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        transaction_image: transaction_image || '',
        paid: 0,
        certificate_image,
      });

      const formatted = CoachModel.formatCoach(coach, user, req);
      return res.status(201).json({
        success: true,
        message: 'Coach registered successfully. Pending approval.',
        coach: formatted,
      });
    } catch (err) {
      console.error('Register coach error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Coach registration failed.' });
    }
  }

  static async registerReferee(req, res) {
    try {
      const b = req.body;
      const files = getFilesMap(req);

      if (!b.email || !b.password || !b.name) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }

      const adhar_image = (files.adhar_image || files.aadhar_image || files.adhar_card)
        ? getRelativePath((files.adhar_image || files.aadhar_image || files.adhar_card)[0])
        : null;
      const passport_image = (files.passport_image || files.passport_photo || files.photo)
        ? getRelativePath((files.passport_image || files.passport_photo || files.photo)[0])
        : null;
      const transaction_image = files.transaction_image ? getRelativePath(files.transaction_image[0]) : (b.transaction_image || '');
      const certificate_image = files.certificate_image ? getRelativePath(files.certificate_image[0]) : null;

      const user = UserModel.create({
        username: b.username || `${b.email.trim()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email: b.email.trim(),
        password: hashPassword(b.password),
        name: b.name,
        role: 'referee',
        phone_number: b.phone_number || '',
        gender: b.gender || '',
        father_name: b.father_name || '',
        mother_name: b.mother_name || '',
        blood_group: b.blood_group || '',
        date_of_birth: b.date_of_birth || null,
        adhar_number: b.adhar_number || '',
        adhar_image,
        passport_image,
      });

      const referee = RefereeModel.create({
        user_id: user.id,
        district: b.district || '',
        occupation: b.occupation || '',
        grade_applying_for: b.grade_applying_for || '',
        year_of_officiating_experience: b.year_of_officiating_experience || 0,
        highest_level_officiated: b.highest_level_officiated || '',
        tournament_officiated: b.tournament_officiated || '',
        previous_referee_id: b.previous_referee_id || `REF_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        transaction_id: b.transaction_id || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        transaction_image: transaction_image || '',
        paid: 0,
        certificate_image,
      });

      const formatted = RefereeModel.formatReferee(referee, user, req);
      return res.status(201).json({
        success: true,
        message: 'Referee registered successfully. Pending approval.',
        referee: formatted,
      });
    } catch (err) {
      console.error('Register referee error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Referee registration failed.' });
    }
  }

  static async registerAcademy(req, res) {
    try {
      const b = req.body;
      const files = getFilesMap(req);

      if (!b.email || !b.name) {
        return res.status(400).json({ success: false, message: 'Academy name and email are required.' });
      }

      const user = UserModel.create({
        username: b.username || `${b.email.trim()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email: b.email.trim(),
        password: hashPassword(b.password || 'Academy@1234'),
        name: b.director_name || b.name,
        role: 'academy',
        phone_number: b.office_phone_number || '',
      });

      const logo = files.logo ? getRelativePath(files.logo[0]) : null;
      const registration_certificate = files.registration_certificate ? getRelativePath(files.registration_certificate[0]) : null;
      const address_proof = files.address_proof ? getRelativePath(files.address_proof[0]) : null;
      const transaction_image = files.transaction_image ? getRelativePath(files.transaction_image[0]) : (b.transaction_image || '');

      const facility_photos = [];
      if (files.facility_photos) {
        for (const f of files.facility_photos) {
          facility_photos.push(getRelativePath(f));
        }
      }

      const academy = AcademyModel.create({
        ...b,
        user_id: user.id,
        director_id: user.id,
        logo: logo || '',
        registration_certificate,
        address_proof,
        transaction_image: transaction_image || '',
        facility_photos,
        paid: 0,
      });

      return res.status(201).json({
        success: true,
        message: 'Academy registered successfully. Pending approval.',
        academy: AcademyModel.formatAcademy(academy, req),
      });
    } catch (err) {
      console.error('Register academy error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Academy registration failed.' });
    }
  }


  static async registerDistrict(req, res) {
    try {
      const b = req.body;
      const fileList = Array.isArray(req.files) ? req.files : [];
      const files = fileList.reduce((acc, f) => {
        acc[f.fieldname] = acc[f.fieldname] || [];
        acc[f.fieldname].push(f);
        return acc;
      }, {});
      if (!Array.isArray(req.files) && req.files) {
        Object.assign(files, req.files);
      }

      if (!b.email || !b.name) {
        return res.status(400).json({ success: false, message: 'District name and email are required.' });
      }

      let user = UserModel.findByEmail(b.email);
      if (!user) {
        user = UserModel.create({
          username: b.email,
          email: b.email,
          password: hashPassword(b.password || 'District@1234'),
          name: b.name,
          role: 'district',
          phone_number: b.office_phone_number || '',
        });
      }

      // Office Bearer: Adhyaksha (President)
      let adhyakshaId = null;
      if (b.adhyaksha_name) {
        const adhyakshaEmail = b.adhyaksha_email || `adhyaksha_${Date.now()}@upha.org`;
        let adhyakshaUser = UserModel.findByEmail(adhyakshaEmail);
        if (!adhyakshaUser) {
          const adharImg = files.adhyaksha_adhar_image ? getRelativePath(files.adhyaksha_adhar_image[0]) : null;
          const passImg = files.adhyaksha_passport_image ? getRelativePath(files.adhyaksha_passport_image[0]) : null;
          adhyakshaUser = UserModel.create({
            username: adhyakshaEmail,
            email: adhyakshaEmail,
            password: hashPassword('Officer@1234'),
            name: b.adhyaksha_name,
            role: 'official',
            phone_number: b.adhyaksha_phone_number || b.adhyaksha_phone || '',
            father_name: b.adhyaksha_father_name || '',
            adhar_number: b.adhyaksha_adhar_number || null,
            adhar_image: adharImg,
            passport_image: passImg,
          });
        } else if (b.adhyaksha_phone_number) {
          db.prepare('UPDATE users_user SET phone_number = ?, name = COALESCE(?, name) WHERE id = ?').run(
            b.adhyaksha_phone_number,
            b.adhyaksha_name,
            adhyakshaUser.id
          );
        }
        adhyakshaId = adhyakshaUser?.id || null;
      }

      // Office Bearer: Sachiv (Secretary)
      let sachivId = null;
      if (b.sachiv_name) {
        const sachivEmail = b.sachiv_email || `sachiv_${Date.now()}@upha.org`;
        let sachivUser = UserModel.findByEmail(sachivEmail);
        if (!sachivUser) {
          const adharImg = files.sachiv_adhar_image ? getRelativePath(files.sachiv_adhar_image[0]) : null;
          const passImg = files.sachiv_passport_image ? getRelativePath(files.sachiv_passport_image[0]) : null;
          sachivUser = UserModel.create({
            username: sachivEmail,
            email: sachivEmail,
            password: hashPassword('Officer@1234'),
            name: b.sachiv_name,
            role: 'official',
            phone_number: b.sachiv_phone_number || b.sachiv_phone || '',
            father_name: b.sachiv_father_name || '',
            adhar_number: b.sachiv_adhar_number || null,
            adhar_image: adharImg,
            passport_image: passImg,
          });
        } else if (b.sachiv_phone_number) {
          db.prepare('UPDATE users_user SET phone_number = ?, name = COALESCE(?, name) WHERE id = ?').run(
            b.sachiv_phone_number,
            b.sachiv_name,
            sachivUser.id
          );
        }
        sachivId = sachivUser?.id || null;
      }

      // Office Bearer: Koshadhyaksha (Treasurer)
      let koshadhyakshaId = null;
      if (b.koshadhyaksha_name) {
        const koshadhyakshaEmail = b.koshadhyaksha_email || `koshadhyaksha_${Date.now()}@upha.org`;
        let koshadhyakshaUser = UserModel.findByEmail(koshadhyakshaEmail);
        if (!koshadhyakshaUser) {
          const adharImg = files.koshadhyaksha_adhar_image ? getRelativePath(files.koshadhyaksha_adhar_image[0]) : null;
          const passImg = files.koshadhyaksha_passport_image ? getRelativePath(files.koshadhyaksha_passport_image[0]) : null;
          koshadhyakshaUser = UserModel.create({
            username: koshadhyakshaEmail,
            email: koshadhyakshaEmail,
            password: hashPassword('Officer@1234'),
            name: b.koshadhyaksha_name,
            role: 'official',
            phone_number: b.koshadhyaksha_phone_number || b.koshadhyaksha_phone || '',
            father_name: b.koshadhyaksha_father_name || '',
            adhar_number: b.koshadhyaksha_adhar_number || null,
            adhar_image: adharImg,
            passport_image: passImg,
          });
        } else if (b.koshadhyaksha_phone_number) {
          db.prepare('UPDATE users_user SET phone_number = ?, name = COALESCE(?, name) WHERE id = ?').run(
            b.koshadhyaksha_phone_number,
            b.koshadhyaksha_name,
            koshadhyakshaUser.id
          );
        }
        koshadhyakshaId = koshadhyakshaUser?.id || null;
      }

      const logo = files.logo ? getRelativePath(files.logo[0]) : null;
      const registration_certificate = files.registration_certificate ? getRelativePath(files.registration_certificate[0]) : null;
      const transaction_image = files.transaction_image ? getRelativePath(files.transaction_image[0]) : (b.transaction_image || '');

      const district = DistrictModel.create({
        ...b,
        user_id: user.id,
        adhyaksha_id: adhyakshaId,
        sachiv_id: sachivId,
        koshadhyaksha_id: koshadhyakshaId,
        logo: logo || '',
        registration_certificate,
        transaction_image: transaction_image || '',
        paid: 0,
      });

      return res.status(201).json({
        success: true,
        message: 'District association registered successfully. Pending approval.',
        district: DistrictModel.formatDistrict(district, req),
      });
    } catch (err) {
      console.error('Register district error:', err);
      return res.status(500).json({ success: false, message: err.message || 'District registration failed.' });
    }
  }
}

module.exports = RegistrationController;
