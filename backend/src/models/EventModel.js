const db = require('../config/database');
const { buildMediaUrl } = require('../utils/mediaUtils');

class EventModel {
  static findById(id) {
    return db.prepare('SELECT * FROM events_event WHERE id = ?').get(id);
  }

  static findAll(year, req) {
    let query = 'SELECT * FROM events_event WHERE 1=1';
    const params = [];

    if (year) {
      query += " AND strftime('%Y', start_date) = ?";
      params.push(String(year));
    }

    query += ' ORDER BY start_date DESC';
    const events = db.prepare(query).all(...params);

    return events.map((ev) => this.formatEvent(ev, req));
  }

  static findYears() {
    const rows = db.prepare("SELECT DISTINCT strftime('%Y', start_date) as year FROM events_event WHERE start_date IS NOT NULL ORDER BY year DESC").all();
    return rows.map((r) => r.year).filter(Boolean);
  }

  static create({ name, location, venue = null, start_date, end_date, registration_end_date, category, image = null }) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO events_event (name, location, venue, start_date, end_date, registration_end_date, category, image, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, location, venue, start_date, end_date, registration_end_date, category, image, now);
    return this.findById(info.lastInsertRowid);
  }

  static update(id, { name, location, venue = null, start_date, end_date, registration_end_date, category, image }) {
    if (image !== undefined) {
      db.prepare(`
        UPDATE events_event
        SET name = ?, location = ?, venue = ?, start_date = ?, end_date = ?, registration_end_date = ?, category = ?, image = ?
        WHERE id = ?
      `).run(name, location, venue, start_date, end_date, registration_end_date, category, image, id);
    } else {
      db.prepare(`
        UPDATE events_event
        SET name = ?, location = ?, venue = ?, start_date = ?, end_date = ?, registration_end_date = ?, category = ?
        WHERE id = ?
      `).run(name, location, venue, start_date, end_date, registration_end_date, category, id);
    }
    return this.findById(id);
  }

  static delete(id) {
    db.prepare('DELETE FROM events_eventresults WHERE event_id = ?').run(id);
    db.prepare('DELETE FROM events_tournamentstanding WHERE event_id = ?').run(id);
    db.prepare('DELETE FROM events_tournamentresult WHERE event_id = ?').run(id);
    db.prepare('DELETE FROM events_eventassignment WHERE event_id = ?').run(id);
    return db.prepare('DELETE FROM events_event WHERE id = ?').run(id);
  }

  static findResults(eventId) {
    const query = `
      SELECT er.id, er.position, er.event_id, p.id as player_id, u.name as player_name, p.district
      FROM events_eventresults er
      JOIN users_player p ON er.player_id = p.id
      JOIN users_user u ON p.user_id = u.id
      WHERE er.event_id = ?
      ORDER BY er.position ASC
    `;
    return db.prepare(query).all(eventId).map((r) => ({
      id: r.id,
      position: r.position,
      event: { id: r.event_id },
      player: {
        id: r.player_id,
        user: { name: r.player_name },
        district: r.district,
      },
    }));
  }

  static addResult(eventId, playerId, position) {
    const stmt = db.prepare('INSERT INTO events_eventresults (event_id, player_id, position) VALUES (?, ?, ?)');
    const info = stmt.run(eventId, playerId, position);
    return db.prepare('SELECT * FROM events_eventresults WHERE id = ?').get(info.lastInsertRowid);
  }

  static deleteResult(resultId) {
    return db.prepare('DELETE FROM events_eventresults WHERE id = ?').run(resultId);
  }

  static findTournamentResult(eventId, req) {
    const tr = db.prepare('SELECT * FROM events_tournamentresult WHERE event_id = ?').get(eventId);
    if (!tr) return null;
    const standings = db.prepare('SELECT * FROM events_tournamentstanding WHERE event_id = ? ORDER BY position ASC').all(eventId);

    return {
      id: tr.id,
      event_id: tr.event_id,
      final_date: tr.final_date,
      total_matches: tr.total_matches,
      top_scorer: tr.top_scorer,
      best_player: tr.best_player,
      best_goalkeeper: tr.best_goalkeeper,
      most_promising_junior: tr.most_promising_junior,
      scoresheet: buildMediaUrl(req, tr.scoresheet),
      standings: standings.map((s) => ({
        id: s.id,
        position: s.position,
        team_name: s.team_name,
        notes: s.notes,
      })),
    };
  }

  static saveTournamentResult({
    event_id,
    final_date,
    total_matches,
    top_scorer = '',
    best_player = '',
    best_goalkeeper = '',
    most_promising_junior = '',
    scoresheet = null,
    standings = [],
  }) {
    const existing = db.prepare('SELECT id FROM events_tournamentresult WHERE event_id = ?').get(event_id);
    const now = new Date().toISOString();

    if (existing) {
      db.prepare(`
        UPDATE events_tournamentresult
        SET final_date = ?, total_matches = ?, top_scorer = ?, best_player = ?,
            best_goalkeeper = ?, most_promising_junior = ?, scoresheet = COALESCE(?, scoresheet)
        WHERE event_id = ?
      `).run(final_date, total_matches, top_scorer, best_player, best_goalkeeper, most_promising_junior, scoresheet, event_id);
    } else {
      db.prepare(`
        INSERT INTO events_tournamentresult (
          event_id, final_date, total_matches, top_scorer, best_player,
          best_goalkeeper, most_promising_junior, scoresheet, uploaded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(event_id, final_date, total_matches, top_scorer, best_player, best_goalkeeper, most_promising_junior, scoresheet, now);
    }

    if (Array.isArray(standings) && standings.length > 0) {
      db.prepare('DELETE FROM events_tournamentstanding WHERE event_id = ?').run(event_id);
      const stStmt = db.prepare('INSERT INTO events_tournamentstanding (event_id, position, team_name, notes) VALUES (?, ?, ?, ?)');
      for (const st of standings) {
        stStmt.run(event_id, st.position, st.team_name, st.notes || '');
      }
    }
  }

  static deleteTournamentResult(eventId) {
    db.prepare('DELETE FROM events_tournamentstanding WHERE event_id = ?').run(eventId);
    return db.prepare('DELETE FROM events_tournamentresult WHERE event_id = ?').run(eventId);
  }

  static findAssignmentsForReferee(refereeId, req) {
    const query = `
      SELECT ea.id, ea.status, ea.role, ea.created_at, e.id as event_id, e.name as event_name, e.location, e.start_date, e.end_date, e.category
      FROM events_eventassignment ea
      JOIN events_event e ON ea.event_id = e.id
      WHERE ea.referee_id = ?
      ORDER BY e.start_date DESC
    `;
    return db.prepare(query).all(refereeId).map((r) => ({
      id: r.id,
      status: r.status,
      role: r.role,
      created_at: r.created_at,
      event: {
        id: r.event_id,
        name: r.event_name,
        location: r.location,
        start_date: r.start_date,
        end_date: r.end_date,
        category: r.category,
      },
    }));
  }

  static formatEvent(ev, req) {
    if (!ev) return null;
    const results = this.findResults(ev.id);
    const tournamentResult = this.findTournamentResult(ev.id, req);

    return {
      id: ev.id,
      name: ev.name,
      location: ev.location,
      venue: ev.venue || null,
      start_date: ev.start_date,
      end_date: ev.end_date,
      registration_end_date: ev.registration_end_date,
      category: ev.category,
      image: ev.image ? buildMediaUrl(req, ev.image) : null,
      created_at: ev.created_at,
      has_tournament_result: Boolean(tournamentResult),
      results,
      tournament_result: tournamentResult,
    };
  }
}

module.exports = EventModel;
