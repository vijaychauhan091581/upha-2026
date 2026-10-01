const path = require('path');
const db = require('../config/database');
const { MEDIA_ROOT } = require('../config/constants');
const EventModel = require('../models/EventModel');
const CertificateModel = require('../models/CertificateModel');
const { getFirstFile, getRelativePath } = require('../middleware/uploadMiddleware');

class EventController {
  static async listEvents(req, res) {
    try {
      const { year } = req.query;
      const events = EventModel.findAll(year, req);
      return res.json({
        success: true,
        message: 'Events retrieved successfully.',
        year: year || null,
        events,
      });
    } catch (err) {
      console.error('List events error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve events.' });
    }
  }

  static async listEventYears(req, res) {
    try {
      const years = EventModel.findYears();
      return res.json({ success: true, years });
    } catch (err) {
      console.error('List event years error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve event years.' });
    }
  }

  static async listEventResults(req, res) {
    try {
      const rows = db.prepare(`
        SELECT er.id, er.position, er.event_id, e.name as event_name, p.id as player_id, u.name as player_name, p.district
        FROM events_eventresults er
        JOIN events_event e ON er.event_id = e.id
        JOIN users_player p ON er.player_id = p.id
        JOIN users_user u ON p.user_id = u.id
        ORDER BY er.id DESC
      `).all();

      const results = rows.map((r) => ({
        id: r.id,
        position: r.position,
        event: { id: r.event_id, name: r.event_name },
        player: {
          id: r.player_id,
          user: { name: r.player_name },
          district: r.district,
        },
      }));

      return res.json({ success: true, results });
    } catch (err) {
      console.error('List event results error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve event results.' });
    }
  }

  static async createEvent(req, res) {
    try {
      const { name, location, venue, start_date, end_date, registration_end_date, category } = req.body;
      if (!name || !location || !start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'Required event fields are missing.' });
      }

      const imgFile = getFirstFile(req, 'image', 'photo', 'poster', 'cover');
      const imagePath = imgFile ? getRelativePath(imgFile) : null;

      const event = EventModel.create({
        name,
        location,
        venue: venue ? String(venue).trim() : null,
        start_date,
        end_date,
        registration_end_date: registration_end_date || start_date,
        category: category || 'General',
        image: imagePath,
      });

      return res.status(201).json({
        success: true,
        message: 'Event created successfully.',
        event: EventModel.formatEvent(event, req),
      });
    } catch (err) {
      console.error('Create event error:', err);
      return res.status(500).json({ success: false, message: 'Failed to create event.' });
    }
  }

  static async updateEvent(req, res) {
    try {
      const { event_id } = req.params;
      const { name, location, venue, start_date, end_date, registration_end_date, category } = req.body;
      if (!name || !location || !start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'Required event fields are missing.' });
      }

      const imgFile = getFirstFile(req, 'image', 'photo', 'poster', 'cover');
      const imagePath = imgFile ? getRelativePath(imgFile) : undefined;

      const event = EventModel.update(event_id, {
        name,
        location,
        venue: venue !== undefined ? (venue ? String(venue).trim() : null) : null,
        start_date,
        end_date,
        registration_end_date: registration_end_date || start_date,
        category: category || 'General',
        image: imagePath,
      });

      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      return res.json({
        success: true,
        message: 'Event updated successfully.',
        event: EventModel.formatEvent(event, req),
      });
    } catch (err) {
      console.error('Update event error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update event.' });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { event_id } = req.params;
      EventModel.delete(event_id);
      return res.json({ success: true, message: 'Event deleted successfully.' });
    } catch (err) {
      console.error('Delete event error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete event.' });
    }
  }

  static async addEventResult(req, res) {
    try {
      const { event_id } = req.params;
      const { player_id, position } = req.body;
      const result = EventModel.addResult(event_id, player_id, position);
      return res.status(201).json({ success: true, message: 'Event result added.', result });
    } catch (err) {
      console.error('Add event result error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add event result.' });
    }
  }

  static async deleteEventResult(req, res) {
    try {
      const { result_id } = req.params;
      EventModel.deleteResult(result_id);
      return res.json({ success: true, message: 'Event result deleted.' });
    } catch (err) {
      console.error('Delete event result error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete event result.' });
    }
  }

  static async uploadTournamentResults(req, res) {
    try {
      const { event_id } = req.params;
      const b = req.body;
      const file = getFirstFile(req, 'scoresheet', 'file', 'results_file');
      const scoresheet = file ? getRelativePath(file) : null;

      let standings = [];
      if (b.standings) {
        try {
          standings = typeof b.standings === 'string' ? JSON.parse(b.standings) : b.standings;
        } catch (e) {
          standings = [];
        }
      }

      EventModel.saveTournamentResult({
        event_id,
        final_date: b.final_date || null,
        total_matches: b.total_matches ? Number(b.total_matches) : null,
        top_scorer: b.top_scorer || '',
        best_player: b.best_player || '',
        best_goalkeeper: b.best_goalkeeper || '',
        most_promising_junior: b.most_promising_junior || '',
        scoresheet,
        standings,
      });

      return res.json({ success: true, message: 'Tournament results uploaded successfully.' });
    } catch (err) {
      console.error('Upload tournament results error:', err);
      return res.status(500).json({ success: false, message: 'Failed to upload tournament results.' });
    }
  }

  static async deleteTournamentResult(req, res) {
    try {
      const { event_id } = req.params;
      EventModel.deleteTournamentResult(event_id);
      return res.json({ success: true, message: 'Tournament results deleted successfully.' });
    } catch (err) {
      console.error('Delete tournament result error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete tournament results.' });
    }
  }

  static async getParticipantsForCertificates(req, res) {
    try {
      const { event_id } = req.query;
      const players = db.prepare(`
        SELECT p.id as player_id, u.id as user_id, u.name, u.email, p.district
        FROM users_player p
        JOIN users_user u ON p.user_id = u.id
        WHERE p.paid = 1
        ORDER BY u.name ASC
      `).all();

      return res.json({ success: true, participants: players });
    } catch (err) {
      console.error('Get participants error:', err);
      return res.status(500).json({ success: false, message: 'Failed to load participants.' });
    }
  }

  static async issueCertificates(req, res) {
    try {
      const { event_id } = req.params;
      const { user_ids, certificate_type, title } = req.body;
      const event = EventModel.findById(event_id);
      const eventName = event ? event.name : 'State Championship';

      if (Array.isArray(user_ids)) {
        for (const uid of user_ids) {
          CertificateModel.create({
            user_id: uid,
            title: title || `${certificate_type || 'Participation'} Certificate - ${eventName}`,
            status: 'Issued',
            details: `Participated in ${eventName}`,
            certificate_id: `CERT-${event_id}-${uid}-${Date.now().toString().slice(-4)}`,
            icon_type: 'medal',
          });
        }
      }

      return res.json({ success: true, message: 'Certificates issued successfully.' });
    } catch (err) {
      console.error('Issue certificates error:', err);
      return res.status(500).json({ success: false, message: 'Failed to issue certificates.' });
    }
  }
}

module.exports = EventController;
