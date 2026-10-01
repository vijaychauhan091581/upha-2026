const db = require('../config/database');

class DecisionLogModel {
  static findAll(limit = 50) {
    const query = `
      SELECT d.*, u.name as admin_name
      FROM users_decisionlog d
      LEFT JOIN users_user u ON d.admin_id = u.id
      ORDER BY d.id DESC
      LIMIT ?
    `;
    return db.prepare(query).all(limit).map((d) => ({
      id: d.id,
      applicant_type: d.applicant_type,
      applicant_id: d.applicant_id,
      action: d.action,
      applicant_name_ref: d.applicant_name_ref,
      notes: d.notes,
      details: d.details,
      created_at: d.created_at,
      admin: d.admin_id ? { id: d.admin_id, name: d.admin_name } : null,
    }));
  }

  static create({ admin_id, applicant_type, applicant_id, action, applicant_name_ref, notes = '', details = '' }) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO users_decisionlog (admin_id, applicant_type, applicant_id, action, applicant_name_ref, notes, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(admin_id, applicant_type, applicant_id, action, applicant_name_ref, notes, details, now);
    return db.prepare('SELECT * FROM users_decisionlog WHERE id = ?').get(info.lastInsertRowid);
  }
}

module.exports = DecisionLogModel;
