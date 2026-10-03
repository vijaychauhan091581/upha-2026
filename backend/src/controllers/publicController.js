const db = require('../config/database');
const OfficeBearerModel = require('../models/OfficeBearerModel');
const PlayerModel = require('../models/PlayerModel');
const CoachModel = require('../models/CoachModel');
const RefereeModel = require('../models/RefereeModel');
const AcademyModel = require('../models/AcademyModel');
const DistrictModel = require('../models/DistrictModel');
const FormsLettersModel = require('../models/FormsLettersModel');
const NotificationModel = require('../models/NotificationModel');
const CertificateModel = require('../models/CertificateModel');
const EventModel = require('../models/EventModel');

class PublicController {
  static async listOfficeBearers(req, res) {
    try {
      const list = OfficeBearerModel.findAll(req);
      return res.json({
        success: true,
        message: 'Office bearers retrieved successfully.',
        office_bearers: list,
      });
    } catch (err) {
      console.error('List office bearers error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve office bearers.' });
    }
  }

  static async getGlobalStats(req, res) {
    try {
      const districts = db.prepare('SELECT count(*) as c FROM district_district WHERE paid = 1').get().c;
      const players = db.prepare('SELECT count(*) as c FROM users_player WHERE paid = 1').get().c;
      const coaches = db.prepare('SELECT count(*) as c FROM users_coach WHERE paid = 1').get().c;
      const referees = db.prepare('SELECT count(*) as c FROM users_referee WHERE paid = 1').get().c;
      const academies = db.prepare('SELECT count(*) as c FROM academy_academy WHERE paid = 1').get().c;
      const tournaments = db.prepare('SELECT count(*) as c FROM events_event').get().c;

      return res.json({
        success: true,
        message: 'Stats retrieved successfully',
        stats: {
          districts,
          players,
          coaches,
          referees,
          academies,
          tournaments,
        },
      });
    } catch (err) {
      console.error('Get stats error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve global stats.' });
    }
  }

  static async listPlayers(req, res) {
    try {
      const { district, search, paid } = req.query;
      const paidFilter = paid !== undefined ? (paid === 'true' || paid === '1' ? 1 : 0) : null;
      const players = PlayerModel.findAll({ paid: paidFilter, district, search }, req);
      return res.json({ success: true, players });
    } catch (err) {
      console.error('List players error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve players.' });
    }
  }

  static async listCoaches(req, res) {
    try {
      const { district, paid } = req.query;
      const paidFilter = paid !== undefined ? (paid === 'true' || paid === '1' ? 1 : 0) : null;
      const coaches = CoachModel.findAll({ paid: paidFilter, district }, req);
      return res.json({ success: true, coaches });
    } catch (err) {
      console.error('List coaches error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve coaches.' });
    }
  }

  static async listReferees(req, res) {
    try {
      const { district, paid } = req.query;
      const paidFilter = paid !== undefined ? (paid === 'true' || paid === '1' ? 1 : 0) : null;
      const referees = RefereeModel.findAll({ paid: paidFilter, district }, req);
      return res.json({ success: true, referees });
    } catch (err) {
      console.error('List referees error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve referees.' });
    }
  }

  static async listAcademies(req, res) {
    try {
      const { district, paid } = req.query;
      const paidFilter = paid !== undefined ? (paid === 'true' || paid === '1' ? 1 : 0) : null;
      const academies = AcademyModel.findAll({ paid: paidFilter, district }, req);
      return res.json({ success: true, academies });
    } catch (err) {
      console.error('List academies error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve academies.' });
    }
  }

  static async listDistricts(req, res) {
    try {
      const { paid } = req.query;
      const paidFilter = paid !== undefined ? (paid === 'true' || paid === '1' ? 1 : 0) : null;
      const districts = DistrictModel.findAll({ paid: paidFilter }, req);
      return res.json({ success: true, districts });
    } catch (err) {
      console.error('List districts error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve districts.' });
    }
  }

  static async getDistrict(req, res) {
    try {
      const { id } = req.params;
      const district = DistrictModel.findById(id);
      if (!district) {
        return res.status(404).json({ success: false, message: 'District not found.' });
      }
      return res.json({ success: true, district: DistrictModel.formatDistrict(district, req) });
    } catch (err) {
      console.error('Get district error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve district.' });
    }
  }

  static async getRefereeStats(req, res) {
    try {
      const total = db.prepare('SELECT count(*) as c FROM users_referee WHERE paid = 1').get().c;
      const districts = db.prepare('SELECT count(DISTINCT district) as c FROM users_referee WHERE paid = 1').get().c;
      
      const boardMembers = db.prepare(`
        SELECT name, role 
        FROM users_officebearer 
        WHERE role LIKE '%referee%'
        ORDER BY "order" ASC
      `).all().map(m => ({
        name: m.name,
        role: m.role,
        initials: (m.name || '')
          .split(' ')
          .filter(Boolean)
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      }));

      const byGrade = db.prepare('SELECT grade_applying_for as grade, count(*) as count FROM users_referee WHERE paid = 1 GROUP BY grade_applying_for').all();

      return res.json({
        success: true,
        total,
        total_referees: total,
        districts_represented: districts,
        board_count: boardMembers.length,
        board_members: boardMembers,
        by_grade: byGrade,
      });
    } catch (err) {
      console.error('Referee stats error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve referee stats.' });
    }
  }

  static async getDistrictStats(req, res) {
    try {
      const affiliated = db.prepare('SELECT count(*) as c FROM district_district WHERE paid = 1').get().c;
      const totalDistricts = 75;
      const open = Math.max(0, totalDistricts - affiliated);

      const rows = db.prepare(`
        SELECT district, count(*) as player_count
        FROM users_player
        WHERE paid = 1 AND district IS NOT NULL AND district != ''
        GROUP BY district
        ORDER BY player_count DESC
      `).all();

      return res.json({
        success: true,
        total_districts: totalDistricts,
        affiliated: affiliated,
        open: open,
        district_stats: rows,
      });
    } catch (err) {
      console.error('District stats error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve district stats.' });
    }
  }

  static async searchPlayers(req, res) {
    try {
      const { q } = req.query;
      const players = PlayerModel.findAll({ search: q }, req);
      return res.json({ success: true, players });
    } catch (err) {
      console.error('Search players error:', err);
      return res.status(500).json({ success: false, message: 'Failed to search players.' });
    }
  }

  static async listAnnouncements(req, res) {
    try {
      const announcements = FormsLettersModel.findAnnouncements();
      return res.json({ success: true, announcements });
    } catch (err) {
      console.error('List announcements error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve announcements.' });
    }
  }

  static async listAgmLetters(req, res) {
    try {
      const letters = FormsLettersModel.findAgmLetters(req);
      return res.json({ success: true, letters });
    } catch (err) {
      console.error('List AGM letters error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve AGM letters.' });
    }
  }

  static async listUphaForms(req, res) {
    try {
      const forms = FormsLettersModel.findForms(req);
      return res.json({ success: true, forms });
    } catch (err) {
      console.error('List UPHA forms error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve forms.' });
    }
  }

  static async getNotifications(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
      }
      const notifications = NotificationModel.findByUserId(req.user.id);
      return res.json({ success: true, notifications });
    } catch (err) {
      console.error('Get notifications error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
    }
  }

  static async markNotificationRead(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
      }
      const notifId = req.params.notif_id;
      NotificationModel.markRead(notifId, req.user.id);
      return res.json({ success: true, message: 'Notification marked as read.' });
    } catch (err) {
      console.error('Mark notification error:', err);
      return res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
    }
  }

  static async getMyCertificates(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
      }
      const certificates = CertificateModel.findByUserId(req.user.id);
      return res.json({ success: true, certificates });
    } catch (err) {
      console.error('Get certificates error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve certificates.' });
    }
  }

  static async getMyAssignments(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
      }
      const referee = RefereeModel.findByUserId(req.user.id);
      if (!referee) {
        return res.json({ success: true, assignments: [] });
      }
      const assignments = EventModel.findAssignmentsForReferee(referee.id, req);
      return res.json({ success: true, assignments });
    } catch (err) {
      console.error('Get assignments error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve assignments.' });
    }
  }

  static async submitContact(req, res) {
    try {
      const { name, email, phone, category, subject, message } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Full name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message content is required.' });
      }

      const stmt = db.prepare(`
        INSERT INTO contact_messages (name, email, phone, category, subject, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
      `);

      const result = stmt.run(
        name.trim(),
        email.trim(),
        (phone || '').trim(),
        (category || 'general').trim(),
        (subject || '').trim(),
        message.trim()
      );

      const refNumber = `UPHA-INQ-${String(result.lastInsertRowid).padStart(5, '0')}`;

      return res.json({
        success: true,
        message: 'Thank you for reaching out. Your message has been received by the UPHA Secretariat.',
        reference_number: refNumber,
        id: result.lastInsertRowid
      });
    } catch (err) {
      console.error('Submit contact error:', err);
      return res.status(500).json({ success: false, message: 'Failed to submit message. Please try again later.' });
    }
  }
}

module.exports = PublicController;
