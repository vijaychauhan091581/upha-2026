const db = require('../config/database');
const { buildMediaUrl } = require('../utils/mediaUtils');

class FormsLettersModel {
  // Forms
  static findForms(req) {
    const rows = db.prepare('SELECT * FROM users_uphaform ORDER BY id DESC').all();
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      file: buildMediaUrl(req, r.file),
      created_at: r.created_at,
    }));
  }

  static createForm({ title, file }) {
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO users_uphaform (title, file, created_at) VALUES (?, ?, ?)');
    const info = stmt.run(title, file, now);
    return db.prepare('SELECT * FROM users_uphaform WHERE id = ?').get(info.lastInsertRowid);
  }

  static deleteForm(id) {
    return db.prepare('DELETE FROM users_uphaform WHERE id = ?').run(id);
  }

  // AGM Letters
  static findAgmLetters(req) {
    const rows = db.prepare('SELECT * FROM users_agmletter ORDER BY letter_date DESC, id DESC').all();
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      letter_date: r.letter_date,
      letter_type: r.letter_type,
      file: buildMediaUrl(req, r.file),
      created_at: r.created_at,
    }));
  }

  static createAgmLetter({ title, description = '', letter_date, letter_type = 'general', file = null, created_by_id = null }) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO users_agmletter (title, description, letter_date, letter_type, file, created_at, created_by_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, description, letter_date, letter_type, file, now, created_by_id);
    return db.prepare('SELECT * FROM users_agmletter WHERE id = ?').get(info.lastInsertRowid);
  }

  static deleteAgmLetter(id) {
    return db.prepare('DELETE FROM users_agmletter WHERE id = ?').run(id);
  }

  // Announcements
  static findAnnouncements() {
    return db.prepare('SELECT * FROM users_announcement ORDER BY id DESC').all();
  }

  static createAnnouncement({ title, message, created_by_id = null }) {
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO users_announcement (title, message, created_at, created_by_id) VALUES (?, ?, ?, ?)');
    const info = stmt.run(title, message, now, created_by_id);
    return db.prepare('SELECT * FROM users_announcement WHERE id = ?').get(info.lastInsertRowid);
  }

  static updateAnnouncement(id, { title, message }) {
    db.prepare('UPDATE users_announcement SET title = ?, message = ? WHERE id = ?').run(title, message, id);
    return db.prepare('SELECT * FROM users_announcement WHERE id = ?').get(id);
  }

  static deleteAnnouncement(id) {
    return db.prepare('DELETE FROM users_announcement WHERE id = ?').run(id);
  }
}

module.exports = FormsLettersModel;
