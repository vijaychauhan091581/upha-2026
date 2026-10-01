const db = require('../config/database');
const { buildMediaUrl } = require('../utils/mediaUtils');

class OfficeBearerModel {
  static findAll(req) {
    const rows = db.prepare('SELECT * FROM users_officebearer ORDER BY "order" ASC, id ASC').all();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      image: buildMediaUrl(req, r.image),
      order: r.order,
      term: r.term || '',
    }));
  }

  static findById(id) {
    return db.prepare('SELECT * FROM users_officebearer WHERE id = ?').get(id);
  }

  static create({ name, role, image = null, order = 0, term = '' }) {
    const stmt = db.prepare('INSERT INTO users_officebearer (name, role, image, "order", term) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, role, image, Number(order) || 0, term);
    return this.findById(info.lastInsertRowid);
  }

  static update(id, { name, role, image, order, term }) {
    let query = 'UPDATE users_officebearer SET name = COALESCE(?, name), role = COALESCE(?, role), "order" = COALESCE(?, "order"), term = COALESCE(?, term)';
    const params = [name, role, order !== undefined ? Number(order) : null, term];

    if (image !== undefined) {
      query += ', image = ?';
      params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.prepare(query).run(...params);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM users_officebearer WHERE id = ?').run(id);
  }
}

module.exports = OfficeBearerModel;
