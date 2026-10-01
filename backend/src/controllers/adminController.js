const db = require('../config/database');
const path = require('path');
const PlayerModel = require('../models/PlayerModel');
const CoachModel = require('../models/CoachModel');
const RefereeModel = require('../models/RefereeModel');
const AcademyModel = require('../models/AcademyModel');
const DistrictModel = require('../models/DistrictModel');
const UserModel = require('../models/UserModel');
const DecisionLogModel = require('../models/DecisionLogModel');
const NotificationModel = require('../models/NotificationModel');
const CertificateModel = require('../models/CertificateModel');
const OfficeBearerModel = require('../models/OfficeBearerModel');
const FormsLettersModel = require('../models/FormsLettersModel');
const { buildMediaUrl } = require('../utils/mediaUtils');

function getRelativePath(file) {
  if (!file) return null;
  return path.relative(path.resolve(__dirname, '../../../backend/media'), file.path).replace(/\\/g, '/');
}

function normalizeType(type) {
  if (!type) return '';
  const t = type.toLowerCase().trim();
  if (t === 'coach' || t === 'coaches' || t === 'coachs') return 'coaches';
  if (t === 'player' || t === 'players') return 'players';
  if (t === 'referee' || t === 'referees') return 'referees';
  if (t === 'academy' || t === 'academies' || t === 'academys') return 'academies';
  if (t === 'district' || t === 'districts') return 'districts';
  return t.endsWith('s') ? t : `${t}s`;
}

class AdminController {
  static async getAdminStats(req, res) {
    try {
      const pendingPlayers = db.prepare('SELECT count(*) as c FROM users_player WHERE paid = 0').get().c;
      const pendingCoaches = db.prepare('SELECT count(*) as c FROM users_coach WHERE paid = 0').get().c;
      const pendingReferees = db.prepare('SELECT count(*) as c FROM users_referee WHERE paid = 0').get().c;
      const pendingAcademies = db.prepare('SELECT count(*) as c FROM academy_academy WHERE paid = 0').get().c;
      const pendingDistricts = db.prepare('SELECT count(*) as c FROM district_district WHERE paid = 0').get().c;

      const totalPlayers = db.prepare('SELECT count(*) as c FROM users_player WHERE paid = 1').get().c;
      const totalCoaches = db.prepare('SELECT count(*) as c FROM users_coach WHERE paid = 1').get().c;
      const totalReferees = db.prepare('SELECT count(*) as c FROM users_referee WHERE paid = 1').get().c;
      const totalAcademies = db.prepare('SELECT count(*) as c FROM academy_academy WHERE paid = 1').get().c;
      const totalDistricts = db.prepare('SELECT count(*) as c FROM district_district WHERE paid = 1').get().c;

      const totalPending = pendingPlayers + pendingCoaches + pendingReferees + pendingAcademies + pendingDistricts;

      // Event counts
      let activeEvents = 0;
      let draftEvents = 0;
      try {
        const totalEvents = db.prepare('SELECT count(*) as c FROM events_event').get().c;
        const upcomingEvents = db.prepare("SELECT count(*) as c FROM events_event WHERE date(end_date) >= date('now')").get().c;
        activeEvents = upcomingEvents > 0 ? upcomingEvents : totalEvents;
        draftEvents = totalEvents > activeEvents ? totalEvents - activeEvents : 0;
      } catch (e) {}

      // Gallery albums count
      let galleryAlbums = 0;
      try {
        galleryAlbums = db.prepare('SELECT count(*) as c FROM gallery_galleryalbum').get().c;
      } catch (e) {}

      // Active admins
      let activeAdmins = 1;
      try {
        activeAdmins = db.prepare("SELECT count(*) as c FROM users_user WHERE role = 'admin'").get().c;
      } catch (e) {}

      // Notices
      let scheduledNotices = 0;
      try {
        scheduledNotices = db.prepare('SELECT count(*) as c FROM users_announcement').get().c;
      } catch (e) {}

      // Recent decision log stats
      const todayIso = new Date().toISOString().slice(0, 10);
      let approvedToday = 0;
      let approvedThisWeek = 0;
      let rejectedThisMonth = 0;

      try {
        approvedToday = db.prepare("SELECT count(*) as c FROM users_decisionlog WHERE action = 'Approved' AND (date(created_at) = date('now') OR created_at LIKE ?)").get(`${todayIso}%`).c;
        approvedThisWeek = db.prepare("SELECT count(*) as c FROM users_decisionlog WHERE action = 'Approved' AND created_at >= date('now', '-7 days')").get().c;
        rejectedThisMonth = db.prepare("SELECT count(*) as c FROM users_decisionlog WHERE action = 'Rejected' AND created_at >= date('now', '-30 days')").get().c;
      } catch (e) {}

      const decisions = DecisionLogModel.findAll(10);

      return res.json({
        success: true,
        message: 'Admin stats retrieved.',
        stats: {
          total_pending: totalPending,
          approved_today: approvedToday,
          approved_this_week: approvedThisWeek,
          rejected_this_month: rejectedThisMonth,
          pending_players: pendingPlayers,
          pending_coaches: pendingCoaches,
          pending_referees: pendingReferees,
          pending_academies: pendingAcademies,
          pending_districts: pendingDistricts,
          total_players: totalPlayers,
          total_coaches: totalCoaches,
          total_referees: totalReferees,
          total_academies: totalAcademies,
          total_districts: totalDistricts,
          active_events: activeEvents,
          draft_events: draftEvents,
          results_awaiting: 0,
          gallery_albums: galleryAlbums,
          active_admins: activeAdmins,
          scheduled_notices: scheduledNotices,

          // Legacy nested objects
          pending: {
            players: pendingPlayers,
            coaches: pendingCoaches,
            referees: pendingReferees,
            academies: pendingAcademies,
            districts: pendingDistricts,
            total: totalPending,
          },
          total: {
            players: totalPlayers,
            coaches: totalCoaches,
            referees: totalReferees,
            academies: totalAcademies,
            districts: totalDistricts,
          },
          recent_decisions: decisions,
        },
      });
    } catch (err) {
      console.error('Admin stats error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
    }
  }

  static async getRecentDecisions(req, res) {
    try {
      const decisions = DecisionLogModel.findAll(50);
      return res.json({ success: true, decisions });
    } catch (err) {
      console.error('Get decisions error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve decisions.' });
    }
  }

  static async updatePaymentStatus(req, res) {
    try {
      const { type, id } = req.params;
      const normType = normalizeType(type);
      const { paid, notes } = req.body;
      const adminId = req.user ? req.user.id : null;
      const isPaid = paid === true || paid === 'true' || paid === 1 || paid === '1';

      let target = null;
      let user = null;

      if (normType === 'players') {
        target = PlayerModel.findById(id);
        if (!target) return res.status(404).json({ success: false, message: 'Player not found' });
        PlayerModel.updatePaymentStatus(id, isPaid);
        user = UserModel.findById(target.user_id);
      } else if (normType === 'coaches') {
        target = CoachModel.findById(id);
        if (!target) return res.status(404).json({ success: false, message: 'Coach not found' });
        CoachModel.updatePaymentStatus(id, isPaid);
        user = UserModel.findById(target.user_id);
      } else if (normType === 'referees') {
        target = RefereeModel.findById(id);
        if (!target) return res.status(404).json({ success: false, message: 'Referee not found' });
        RefereeModel.updatePaymentStatus(id, isPaid);
        user = UserModel.findById(target.user_id);
      } else if (normType === 'academies') {
        target = AcademyModel.findById(id);
        if (!target) return res.status(404).json({ success: false, message: 'Academy not found' });
        AcademyModel.updatePaymentStatus(id, isPaid);
        user = UserModel.findById(target.user_id);
      } else if (normType === 'districts') {
        target = DistrictModel.findById(id);
        if (!target) return res.status(404).json({ success: false, message: 'District not found' });
        DistrictModel.updatePaymentStatus(id, isPaid);
        user = UserModel.findById(target.user_id);
      } else {
        if (typeof next === 'function') return next();
        return res.status(400).json({ success: false, message: 'Invalid entity type' });
      }

      const action = isPaid ? 'Approved' : 'Unapproved';
      const applicantName = user ? user.name : (target.name || `ID ${id}`);

      DecisionLogModel.create({
        admin_id: adminId,
        applicant_type: type.slice(0, -1),
        applicant_id: id,
        action,
        applicant_name_ref: applicantName,
        notes: notes || '',
        details: `${action} ${type.slice(0, -1)} application.`,
      });

      if (user) {
        NotificationModel.create({
          user_id: user.id,
          title: `Application ${action}`,
          message: isPaid
            ? 'Your application and fee payment have been verified and approved by the administrator.'
            : 'Your application payment status has been updated by the administrator.',
        });

        if (isPaid && type === 'players') {
          CertificateModel.create({
            user_id: user.id,
            title: 'Official Player Registration Certificate',
            status: 'Active',
            details: `Registered Player for ${target.district || 'UPHA'}`,
            certificate_id: `UPHA-PLR-${Date.now().toString().slice(-6)}`,
            icon_type: 'trophy',
          });
        }
      }

      let updatedRecord = null;
      if (type === 'players') {
        updatedRecord = PlayerModel.findFullPlayer(id, req);
      } else if (type === 'coaches') {
        const c = CoachModel.findById(id);
        const u = c ? UserModel.findById(c.user_id) : null;
        updatedRecord = c ? CoachModel.formatCoach(c, u, req) : null;
      } else if (type === 'referees') {
        const r = RefereeModel.findById(id);
        const u = r ? UserModel.findById(r.user_id) : null;
        updatedRecord = r ? RefereeModel.formatReferee(r, u, req) : null;
      } else if (type === 'academies') {
        const ac = AcademyModel.findById(id);
        updatedRecord = ac ? AcademyModel.formatAcademy(ac, req) : null;
      } else if (type === 'districts') {
        const d = DistrictModel.findById(id);
        updatedRecord = d ? DistrictModel.formatDistrict(d, req) : null;
      }

      const entityKey = type === 'academies' ? 'academy' : type.slice(0, -1);

      return res.json({
        success: true,
        message: `${entityKey} payment status updated to ${isPaid ? 'Approved' : 'Pending'}.`,
        [entityKey]: updatedRecord,
      });
    } catch (err) {
      console.error('Update payment status error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update payment status.' });
    }
  }

  static async rejectApplication(req, res) {
    try {
      const { applicant_type, applicant_id, notes } = req.body;
      const adminId = req.user ? req.user.id : null;

      let applicantName = '';
      let userId = null;

      if (applicant_type === 'player') {
        const p = PlayerModel.findById(applicant_id);
        if (p) {
          const u = UserModel.findById(p.user_id);
          applicantName = u ? u.name : 'Player';
          userId = p.user_id;
          db.prepare('DELETE FROM users_player WHERE id = ?').run(applicant_id);
        }
      } else if (applicant_type === 'coach') {
        const c = CoachModel.findById(applicant_id);
        if (c) {
          const u = UserModel.findById(c.user_id);
          applicantName = u ? u.name : 'Coach';
          userId = c.user_id;
          db.prepare('DELETE FROM users_coach WHERE id = ?').run(applicant_id);
        }
      } else if (applicant_type === 'referee') {
        const r = RefereeModel.findById(applicant_id);
        if (r) {
          const u = UserModel.findById(r.user_id);
          applicantName = u ? u.name : 'Referee';
          userId = r.user_id;
          db.prepare('DELETE FROM users_referee WHERE id = ?').run(applicant_id);
        }
      } else if (applicant_type === 'academy') {
        const a = AcademyModel.findById(applicant_id);
        if (a) {
          applicantName = a.name;
          userId = a.user_id;
          db.prepare('DELETE FROM academy_academy WHERE id = ?').run(applicant_id);
        }
      } else if (applicant_type === 'district') {
        const d = DistrictModel.findById(applicant_id);
        if (d) {
          applicantName = d.name;
          userId = d.user_id;
          db.prepare('DELETE FROM district_district WHERE id = ?').run(applicant_id);
        }
      }

      DecisionLogModel.create({
        admin_id: adminId,
        applicant_type,
        applicant_id,
        action: 'Rejected',
        applicant_name_ref: applicantName,
        notes: notes || '',
        details: `Rejected ${applicant_type} application.`,
      });

      if (userId) {
        NotificationModel.create({
          user_id: userId,
          title: 'Application Rejected',
          message: notes ? `Your application was rejected: ${notes}` : 'Your application was rejected by the administrator.',
        });
      }

      return res.json({ success: true, message: 'Application rejected and removed successfully.' });
    } catch (err) {
      console.error('Reject application error:', err);
      return res.status(500).json({ success: false, message: 'Failed to reject application.' });
    }
  }

  static async uploadPlayerCertificate(req, res) {
    try {
      const playerId = req.params.player_id;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, message: 'No certificate file uploaded.' });
      }

      const relativePath = getRelativePath(file);
      PlayerModel.uploadCertificate(playerId, relativePath);

      return res.json({
        success: true,
        message: 'Certificate uploaded successfully.',
        certificate_image: buildMediaUrl(req, relativePath),
      });
    } catch (err) {
      console.error('Upload certificate error:', err);
      return res.status(500).json({ success: false, message: 'Failed to upload certificate.' });
    }
  }

  static async searchPlayersForCert(req, res) {
    try {
      const { q } = req.query;
      const players = PlayerModel.findAll({ search: q }, req);
      return res.json({ success: true, players });
    } catch (err) {
      console.error('Search players for cert error:', err);
      return res.status(500).json({ success: false, message: 'Failed to search players.' });
    }
  }

  static async manageOfficeBearers(req, res) {
    try {
      const method = req.method;
      if (method === 'POST') {
        const { name, role, order, term } = req.body;
        const file = req.file;
        const image = file ? getRelativePath(file) : null;
        const ob = OfficeBearerModel.create({ name, role, image, order, term });
        return res.status(201).json({ success: true, message: 'Office bearer added.', office_bearer: ob });
      } else if (method === 'PUT' || method === 'PATCH') {
        const { id, name, role, order, term } = req.body;
        const file = req.file;
        const image = file ? getRelativePath(file) : undefined;
        const ob = OfficeBearerModel.update(id, { name, role, image, order, term });
        return res.json({ success: true, message: 'Office bearer updated.', office_bearer: ob });
      } else if (method === 'DELETE') {
        const { id } = req.body;
        OfficeBearerModel.delete(id);
        return res.json({ success: true, message: 'Office bearer deleted.' });
      }
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    } catch (err) {
      console.error('Manage office bearers error:', err);
      return res.status(500).json({ success: false, message: 'Failed to manage office bearers.' });
    }
  }

  static async createAnnouncement(req, res) {
    try {
      const { title, message } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Title is required.' });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
      }
      const adminId = req.user ? req.user.id : null;
      const ann = FormsLettersModel.createAnnouncement({ title: title.trim(), message: message.trim(), created_by_id: adminId });
      return res.status(201).json({ success: true, message: 'Announcement created successfully.', announcement: ann });
    } catch (err) {
      console.error('Create announcement error:', err);
      return res.status(500).json({ success: false, message: 'Failed to create announcement.' });
    }
  }

  static async updateAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const { title, message } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Title is required.' });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
      }
      const ann = FormsLettersModel.updateAnnouncement(id, { title: title.trim(), message: message.trim() });
      if (!ann) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
      }
      return res.json({ success: true, message: 'Announcement updated successfully.', announcement: ann });
    } catch (err) {
      console.error('Update announcement error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update announcement.' });
    }
  }

  static async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params;
      const info = FormsLettersModel.deleteAnnouncement(id);
      if (info.changes === 0) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
      }
      return res.json({ success: true, message: 'Announcement deleted successfully.' });
    } catch (err) {
      console.error('Delete announcement error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
    }
  }

  static async createAgmLetter(req, res) {
    try {
      const { title, description, letter_date, letter_type } = req.body;
      const file = req.file ? getRelativePath(req.file) : null;
      const adminId = req.user ? req.user.id : null;
      const letter = FormsLettersModel.createAgmLetter({
        title,
        description,
        letter_date,
        letter_type,
        file,
        created_by_id: adminId,
      });
      return res.status(201).json({ success: true, message: 'AGM Letter uploaded.', letter });
    } catch (err) {
      console.error('Create AGM letter error:', err);
      return res.status(500).json({ success: false, message: 'Failed to upload AGM letter.' });
    }
  }

  static async deleteAgmLetter(req, res) {
    try {
      const { letter_id } = req.params;
      FormsLettersModel.deleteAgmLetter(letter_id);
      return res.json({ success: true, message: 'AGM Letter deleted.' });
    } catch (err) {
      console.error('Delete AGM letter error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete AGM letter.' });
    }
  }

  static async createUphaForm(req, res) {
    try {
      const { title } = req.body;
      const file = req.file ? getRelativePath(req.file) : null;
      if (!file) {
        return res.status(400).json({ success: false, message: 'Form PDF or document required.' });
      }
      const form = FormsLettersModel.createForm({ title, file });
      return res.status(201).json({ success: true, message: 'Form uploaded successfully.', form });
    } catch (err) {
      console.error('Create UPHA form error:', err);
      return res.status(500).json({ success: false, message: 'Failed to upload UPHA form.' });
    }
  }

  static async deleteUphaForm(req, res) {
    try {
      const { form_id } = req.params;
      FormsLettersModel.deleteForm(form_id);
      return res.json({ success: true, message: 'Form deleted successfully.' });
    } catch (err) {
      console.error('Delete form error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete form.' });
    }
  }

  static async updateRegistration(req, res) {
    try {
      const { type, id } = req.params;
      const normType = normalizeType(type);
      const b = req.body;
      const files = req.files || {};
      const file = (files.image || files.photo || files.passport_image || files.logo)?.[0] || req.file;
      const imagePath = file ? getRelativePath(file) : null;

      if (normType === 'players') {
        const player = PlayerModel.findById(id);
        if (!player) return res.status(404).json({ success: false, message: 'Player not found' });

        const userUpdates = [];
        const userParams = [];
        if (b.name !== undefined) { userUpdates.push('name = ?'); userParams.push(b.name); }
        if (b.email !== undefined) { userUpdates.push('email = ?'); userParams.push(b.email); }
        if (b.phone_number !== undefined) { userUpdates.push('phone_number = ?'); userParams.push(b.phone_number); }
        if (b.gender !== undefined) { userUpdates.push('gender = ?'); userParams.push(b.gender); }
        if (b.father_name !== undefined) { userUpdates.push('father_name = ?'); userParams.push(b.father_name); }
        if (b.mother_name !== undefined) { userUpdates.push('mother_name = ?'); userParams.push(b.mother_name); }
        if (b.blood_group !== undefined) { userUpdates.push('blood_group = ?'); userParams.push(b.blood_group); }
        if (b.date_of_birth !== undefined) { userUpdates.push('date_of_birth = ?'); userParams.push(b.date_of_birth); }
        if (b.adhar_number !== undefined) { userUpdates.push('adhar_number = ?'); userParams.push(b.adhar_number); }
        if (imagePath) { userUpdates.push('passport_image = ?'); userParams.push(imagePath); }

        if (userUpdates.length > 0) {
          userParams.push(player.user_id);
          db.prepare(`UPDATE users_user SET ${userUpdates.join(', ')} WHERE id = ?`).run(...userParams);
        }

        const playerUpdates = [];
        const playerParams = [];
        if (b.district !== undefined) { playerUpdates.push('district = ?'); playerParams.push(b.district); }
        if (b.dominant_hand !== undefined) { playerUpdates.push('dominant_hand = ?'); playerParams.push(b.dominant_hand); }
        if (b.club_name !== undefined) { playerUpdates.push('club_name = ?'); playerParams.push(b.club_name); }
        if (b.school_name !== undefined) { playerUpdates.push('school_name = ?'); playerParams.push(b.school_name); }
        if (b.coach_name !== undefined) { playerUpdates.push('coach_name = ?'); playerParams.push(b.coach_name); }
        if (b.height !== undefined) { playerUpdates.push('height = ?'); playerParams.push(Number(b.height) || 0); }
        if (b.weight !== undefined) { playerUpdates.push('weight = ?'); playerParams.push(Number(b.weight) || 0); }
        if (b.paid !== undefined) {
          const isPaid = b.paid === true || b.paid === 'true' || b.paid === 1 || b.paid === '1';
          playerUpdates.push('paid = ?');
          playerParams.push(isPaid ? 1 : 0);
        }

        if (playerUpdates.length > 0) {
          playerParams.push(id);
          db.prepare(`UPDATE users_player SET ${playerUpdates.join(', ')} WHERE id = ?`).run(...playerParams);
        }

        const updated = PlayerModel.findFullPlayer(id, req);
        return res.json({ success: true, message: 'Player updated successfully', data: updated });
      }

      if (normType === 'referees') {
        const referee = RefereeModel.findById(id);
        if (!referee) return res.status(404).json({ success: false, message: 'Referee not found' });

        const userUpdates = [];
        const userParams = [];
        if (b.name !== undefined) { userUpdates.push('name = ?'); userParams.push(b.name); }
        if (b.email !== undefined) { userUpdates.push('email = ?'); userParams.push(b.email); }
        if (b.phone_number !== undefined) { userUpdates.push('phone_number = ?'); userParams.push(b.phone_number); }
        if (b.mobile !== undefined) { userUpdates.push('phone_number = ?'); userParams.push(b.mobile); }
        if (b.gender !== undefined) { userUpdates.push('gender = ?'); userParams.push(b.gender); }
        if (b.father_name !== undefined) { userUpdates.push('father_name = ?'); userParams.push(b.father_name); }
        if (b.mother_name !== undefined) { userUpdates.push('mother_name = ?'); userParams.push(b.mother_name); }
        if (b.blood_group !== undefined) { userUpdates.push('blood_group = ?'); userParams.push(b.blood_group); }
        if (b.date_of_birth !== undefined) { userUpdates.push('date_of_birth = ?'); userParams.push(b.date_of_birth); }
        if (b.adhar_number !== undefined) { userUpdates.push('adhar_number = ?'); userParams.push(b.adhar_number || null); }
        if (imagePath) { userUpdates.push('passport_image = ?'); userParams.push(imagePath); }

        if (userUpdates.length > 0) {
          userParams.push(referee.user_id);
          db.prepare(`UPDATE users_user SET ${userUpdates.join(', ')} WHERE id = ?`).run(...userParams);
        }

        const refUpdates = [];
        const refParams = [];
        if (b.district !== undefined) { refUpdates.push('district = ?'); refParams.push(b.district); }
        if (b.place !== undefined) { refUpdates.push('district = ?'); refParams.push(b.place); }
        if (b.occupation !== undefined) { refUpdates.push('occupation = ?'); refParams.push(b.occupation); }
        if (b.grade_applying_for !== undefined) { refUpdates.push('grade_applying_for = ?'); refParams.push(b.grade_applying_for); }
        if (b.year_of_officiating_experience !== undefined) { refUpdates.push('year_of_officiating_experience = ?'); refParams.push(Number(b.year_of_officiating_experience) || 0); }
        if (b.highest_level_officiated !== undefined) { refUpdates.push('highest_level_officiated = ?'); refParams.push(b.highest_level_officiated); }
        if (b.tournament_officiated !== undefined) { refUpdates.push('tournament_officiated = ?'); refParams.push(b.tournament_officiated); }
        if (b.previous_referee_id !== undefined) { refUpdates.push('previous_referee_id = ?'); refParams.push(b.previous_referee_id); }
        if (b.paid !== undefined) {
          const isPaid = b.paid === true || b.paid === 'true' || b.paid === 1 || b.paid === '1';
          refUpdates.push('paid = ?');
          refParams.push(isPaid ? 1 : 0);
        }

        if (refUpdates.length > 0) {
          refParams.push(id);
          db.prepare(`UPDATE users_referee SET ${refUpdates.join(', ')} WHERE id = ?`).run(...refParams);
        }

        const user = UserModel.findById(referee.user_id);
        const updated = RefereeModel.formatReferee(RefereeModel.findById(id), user, req);
        return res.json({ success: true, message: 'Referee updated successfully', data: updated });
      }

      if (normType === 'coaches') {
        const coach = CoachModel.findById(id);
        if (!coach) return res.status(404).json({ success: false, message: 'Coach not found' });

        const userUpdates = [];
        const userParams = [];
        if (b.name !== undefined) { userUpdates.push('name = ?'); userParams.push(b.name); }
        if (b.email !== undefined) { userUpdates.push('email = ?'); userParams.push(b.email); }
        if (b.phone_number !== undefined) { userUpdates.push('phone_number = ?'); userParams.push(b.phone_number); }
        if (b.mobile !== undefined) { userUpdates.push('phone_number = ?'); userParams.push(b.mobile); }
        if (b.phone !== undefined) { userUpdates.push('phone_number = ?'); userParams.push(b.phone); }
        if (b.gender !== undefined) { userUpdates.push('gender = ?'); userParams.push(b.gender); }
        if (b.dob !== undefined) { userUpdates.push('date_of_birth = ?'); userParams.push(b.dob || null); }
        if (b.date_of_birth !== undefined) { userUpdates.push('date_of_birth = ?'); userParams.push(b.date_of_birth || null); }
        if (b.father_name !== undefined) { userUpdates.push('father_name = ?'); userParams.push(b.father_name); }
        if (b.mother_name !== undefined) { userUpdates.push('mother_name = ?'); userParams.push(b.mother_name); }
        if (b.blood_group !== undefined) { userUpdates.push('blood_group = ?'); userParams.push(b.blood_group); }
        if (b.adhar_number !== undefined) { userUpdates.push('adhar_number = ?'); userParams.push(b.adhar_number || null); }
        if (imagePath) {
          userUpdates.push('passport_image = ?');
          userParams.push(imagePath);
        } else if (b.remove_photo === '1' || b.remove_photo === 'true' || b.remove_photo === true) {
          userUpdates.push('passport_image = NULL');
        }

        if (userUpdates.length > 0) {
          userParams.push(coach.user_id);
          db.prepare(`UPDATE users_user SET ${userUpdates.join(', ')} WHERE id = ?`).run(...userParams);
        }

        const coachUpdates = [];
        const coachParams = [];
        if (b.district !== undefined) { coachUpdates.push('district = ?'); coachParams.push(b.district); }
        if (b.place !== undefined) { coachUpdates.push('district = ?'); coachParams.push(b.place); }
        if (b.occupation !== undefined) { coachUpdates.push('occupation = ?'); coachParams.push(b.occupation); }
        if (b.highest_coaching_grade !== undefined) { coachUpdates.push('highest_coaching_grade = ?'); coachParams.push(b.highest_coaching_grade); }
        if (b.paid !== undefined) {
          const isPaid = b.paid === true || b.paid === 'true' || b.paid === 1 || b.paid === '1';
          coachUpdates.push('paid = ?');
          coachParams.push(isPaid ? 1 : 0);
        }

        if (coachUpdates.length > 0) {
          coachParams.push(id);
          db.prepare(`UPDATE users_coach SET ${coachUpdates.join(', ')} WHERE id = ?`).run(...coachParams);
        }

        const user = UserModel.findById(coach.user_id);
        const updated = CoachModel.formatCoach(CoachModel.findById(id), user, req);
        return res.json({ success: true, message: 'Coach updated successfully', data: updated });
      }

      if (normType === 'academies') {
        const academy = AcademyModel.findById(id);
        if (!academy) return res.status(404).json({ success: false, message: 'Academy not found' });

        const acUpdates = [];
        const acParams = [];
        const fields = [
          'name', 'district', 'year_of_establishment', 'office_address',
          'office_phone_number', 'email', 'website', 'no_of_players',
          'coach_name', 'coach_mobile', 'coach_email', 'coach_experience',
          'trust_registration_number'
        ];
        for (const f of fields) {
          if (b[f] !== undefined) {
            acUpdates.push(`${f} = ?`);
            acParams.push(b[f]);
          }
        }
        if (imagePath) {
          acUpdates.push('logo = ?');
          acParams.push(imagePath);
        }
        if (b.paid !== undefined) {
          const isPaid = b.paid === true || b.paid === 'true' || b.paid === 1 || b.paid === '1';
          acUpdates.push('paid = ?');
          acParams.push(isPaid ? 1 : 0);
        }

        if (acUpdates.length > 0) {
          acParams.push(id);
          db.prepare(`UPDATE academy_academy SET ${acUpdates.join(', ')} WHERE id = ?`).run(...acParams);
        }

        const updated = AcademyModel.formatAcademy(AcademyModel.findById(id), req);
        return res.json({ success: true, message: 'Academy updated successfully', data: updated });
      }

      if (normType === 'districts') {
        const district = DistrictModel.findById(id);
        if (!district) return res.status(404).json({ success: false, message: 'District not found' });

        const dUpdates = [];
        const dParams = [];
        const fields = [
          'name', 'district', 'year_of_establishment', 'office_address',
          'office_phone_number', 'email', 'website', 'no_of_players',
          'trust_registration_number'
        ];
        for (const f of fields) {
          if (b[f] !== undefined) {
            dUpdates.push(`${f} = ?`);
            dParams.push(b[f]);
          }
        }
        if (imagePath) {
          dUpdates.push('logo = ?');
          dParams.push(imagePath);
        }
        if (b.paid !== undefined) {
          const isPaid = b.paid === true || b.paid === 'true' || b.paid === 1 || b.paid === '1';
          dUpdates.push('paid = ?');
          dParams.push(isPaid ? 1 : 0);
        }

        if (dUpdates.length > 0) {
          dParams.push(id);
          db.prepare(`UPDATE district_district SET ${dUpdates.join(', ')} WHERE id = ?`).run(...dParams);
        }

        const updated = DistrictModel.formatDistrict(DistrictModel.findById(id), req);
        return res.json({ success: true, message: 'District unit updated successfully', data: updated });
      }

      if (typeof next === 'function') return next();
      return res.status(400).json({ success: false, message: 'Invalid entity type' });
    } catch (err) {
      console.error('Update registration error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update registration.' });
    }
  }

  static async removePhoto(req, res) {
    try {
      const { type, id } = req.params;
      const normType = normalizeType(type);

      if (normType === 'coaches') {
        const coach = CoachModel.findById(id);
        if (!coach) return res.status(404).json({ success: false, message: 'Coach not found' });
        db.prepare('UPDATE users_user SET passport_image = NULL WHERE id = ?').run(coach.user_id);
        const user = UserModel.findById(coach.user_id);
        const updated = CoachModel.formatCoach(coach, user, req);
        return res.json({ success: true, message: 'Coach photo removed successfully.', data: updated });
      }

      if (normType === 'referees') {
        const referee = RefereeModel.findById(id);
        if (!referee) return res.status(404).json({ success: false, message: 'Referee not found' });
        db.prepare('UPDATE users_user SET passport_image = NULL WHERE id = ?').run(referee.user_id);
        const user = UserModel.findById(referee.user_id);
        const updated = RefereeModel.formatReferee(referee, user, req);
        return res.json({ success: true, message: 'Referee photo removed successfully.', data: updated });
      }

      if (normType === 'players') {
        const player = PlayerModel.findById(id);
        if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
        db.prepare('UPDATE users_user SET passport_image = NULL WHERE id = ?').run(player.user_id);
        const updated = PlayerModel.findFullPlayer(id, req);
        return res.json({ success: true, message: 'Player photo removed successfully.', data: updated });
      }

      if (typeof next === 'function') return next();
      return res.status(400).json({ success: false, message: 'Invalid entity type.' });
    } catch (err) {
      console.error('Remove photo error:', err);
      return res.status(500).json({ success: false, message: 'Failed to remove photo.' });
    }
  }

  static async deleteRegistration(req, res) {
    try {
      const { type, id } = req.params;
      const normType = normalizeType(type);

      if (normType === 'coaches') {
        const coach = CoachModel.findById(id);
        if (!coach) return res.status(404).json({ success: false, message: 'Coach not found' });
        db.prepare('DELETE FROM users_coach WHERE id = ?').run(id);
        if (coach.user_id) {
          db.prepare('DELETE FROM users_user WHERE id = ?').run(coach.user_id);
        }
        return res.json({ success: true, message: 'Coach deleted successfully.' });
      }

      if (normType === 'players') {
        const player = PlayerModel.findById(id);
        if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
        try { db.prepare('DELETE FROM achievements_playerachievement WHERE player_id = ?').run(id); } catch (e) {}
        try { db.prepare('DELETE FROM events_eventresults WHERE player_id = ?').run(id); } catch (e) {}
        try { db.prepare('DELETE FROM users_decisionlog WHERE applicant_type = ? AND applicant_id = ?').run('player', id); } catch (e) {}
        db.prepare('DELETE FROM users_player WHERE id = ?').run(id);
        if (player.user_id) {
          try { db.prepare('DELETE FROM users_certificate WHERE user_id = ?').run(player.user_id); } catch (e) {}
          try { db.prepare('DELETE FROM users_notification WHERE user_id = ?').run(player.user_id); } catch (e) {}
          try { db.prepare('DELETE FROM users_user WHERE id = ?').run(player.user_id); } catch (e) {}
        }
        return res.json({ success: true, message: 'Player deleted successfully.' });
      }

      if (normType === 'referees') {
        const referee = RefereeModel.findById(id);
        if (!referee) return res.status(404).json({ success: false, message: 'Referee not found' });
        db.prepare('DELETE FROM users_referee WHERE id = ?').run(id);
        if (referee.user_id) {
          db.prepare('DELETE FROM users_user WHERE id = ?').run(referee.user_id);
        }
        return res.json({ success: true, message: 'Referee deleted successfully.' });
      }

      if (normType === 'academies') {
        const academy = AcademyModel.findById(id);
        if (!academy) return res.status(404).json({ success: false, message: 'Academy not found' });
        db.prepare('DELETE FROM academy_academy WHERE id = ?').run(id);
        return res.json({ success: true, message: 'Academy deleted successfully.' });
      }

      if (normType === 'districts') {
        const district = DistrictModel.findById(id);
        if (!district) return res.status(404).json({ success: false, message: 'District not found' });
        db.prepare('DELETE FROM district_district WHERE id = ?').run(id);
        return res.json({ success: true, message: 'District unit deleted successfully.' });
      }

      if (typeof next === 'function') return next();
      return res.status(400).json({ success: false, message: 'Invalid entity type.' });
    } catch (err) {
      console.error('Delete registration error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete registration.' });
    }
  }

  static async bulkApprove(req, res) {
    try {
      db.prepare('UPDATE users_player SET paid = 1 WHERE paid = 0').run();
      db.prepare('UPDATE users_coach SET paid = 1 WHERE paid = 0').run();
      db.prepare('UPDATE users_referee SET paid = 1 WHERE paid = 0').run();
      db.prepare('UPDATE academy_academy SET paid = 1 WHERE paid = 0').run();
      db.prepare('UPDATE district_district SET paid = 1 WHERE paid = 0').run();

      return res.json({ success: true, message: 'All pending applications approved successfully.' });
    } catch (err) {
      console.error('Bulk approve error:', err);
      return res.status(500).json({ success: false, message: 'Failed to bulk approve.' });
    }
  }

  static async createCoach(req, res) {
    try {
      const {
        name,
        district,
        place,
        email,
        phone,
        mobile,
        phone_number,
        gender,
        dob,
        date_of_birth,
        occupation,
        highest_coaching_grade
      } = req.body;

      const coachDistrict = (district || place || '').trim();
      if (!name || !coachDistrict) {
        return res.status(400).json({ success: false, message: 'Name and district are required.' });
      }

      let imagePath = null;
      if (req.files) {
        const file = req.files.passport_image?.[0] || req.files.photo?.[0] || req.files.image?.[0];
        if (file) {
          imagePath = `members/${file.filename}`;
        }
      }

      const timestamp = Date.now();
      const username = `coach_${timestamp}_${Math.floor(Math.random() * 1000)}`;
      const coachEmail = (email && email.trim()) ? email.trim() : `${username}@upha.org`;

      if (email && email.trim()) {
        const existingUser = UserModel.findByEmail(email.trim());
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: `Email "${email.trim()}" pehle se kisi doosre account ke saath registered hai.`
          });
        }
      }

      const contactPhone = (phone || phone_number || mobile || '').trim();
      const coachGender = (gender || '').trim();
      const coachDob = date_of_birth || dob || null;

      const user = UserModel.create({
        username,
        email: coachEmail,
        password: `UPHACoach@${Math.floor(1000 + Math.random() * 9000)}`,
        name: name.trim(),
        role: 'coach',
        phone_number: contactPhone,
        gender: coachGender,
        date_of_birth: coachDob,
        passport_image: imagePath,
      });

      const coach = CoachModel.create({
        user_id: user.id,
        district: coachDistrict,
        occupation: occupation || 'State Handball Coach',
        highest_coaching_grade: highest_coaching_grade || 'Certified Coach',
        paid: 1,
      });

      const formatted = CoachModel.formatCoach(coach, user, req);
      return res.status(201).json({
        success: true,
        message: 'Coach added successfully',
        coach: formatted,
        data: formatted,
      });
    } catch (err) {
      console.error('Admin create coach error:', err);
      return res.status(500).json({ success: false, message: 'Failed to create coach.' });
    }
  }

  static async createReferee(req, res) {
    try {
      const { name, district, email, phone, mobile, grade, grade_applying_for } = req.body;
      if (!name || !district) {
        return res.status(400).json({ success: false, message: 'Name and district are required.' });
      }

      let imagePath = null;
      if (req.files) {
        const file = req.files.passport_image?.[0] || req.files.photo?.[0] || req.files.image?.[0];
        if (file) {
          imagePath = `members/${file.filename}`;
        }
      }

      const timestamp = Date.now();
      const username = `referee_${timestamp}_${Math.floor(Math.random() * 1000)}`;
      const refEmail = email || `${username}@upha.org`;
      const contactPhone = phone || mobile || '';

      const user = UserModel.create({
        username,
        email: refEmail,
        password: `UPHAReferee@${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        role: 'referee',
        phone_number: contactPhone,
        passport_image: imagePath,
      });

      const referee = RefereeModel.create({
        user_id: user.id,
        district,
        grade_applying_for: grade || grade_applying_for || 'State',
        paid: 1,
      });

      const formatted = RefereeModel.formatReferee(referee, user, req);
      return res.status(201).json({
        success: true,
        message: 'Referee added successfully',
        referee: formatted,
        data: formatted,
      });
    } catch (err) {
      console.error('Admin create referee error:', err);
      return res.status(500).json({ success: false, message: 'Failed to create referee.' });
    }
  }
}

module.exports = AdminController;
