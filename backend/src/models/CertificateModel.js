const db = require('../config/database');

class CertificateModel {
  static findByUserId(userId) {
    return db.prepare('SELECT * FROM users_certificate WHERE user_id = ? ORDER BY id DESC').all(userId);
  }

  static findByCertId(certId) {
    return db.prepare('SELECT * FROM users_certificate WHERE certificate_id = ?').get(certId);
  }

  static create({ user_id, title, status = 'Issued', details = '', certificate_id, icon_type = 'trophy' }) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO users_certificate (user_id, title, status, details, certificate_id, icon_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(user_id, title, status, details, certificate_id, icon_type, now);
    return db.prepare('SELECT * FROM users_certificate WHERE id = ?').get(info.lastInsertRowid);
  }
}

module.exports = CertificateModel;
