const db = require('../config/database');

class NotificationModel {
  static findByUserId(userId) {
    return db.prepare('SELECT * FROM users_notification WHERE user_id = ? ORDER BY id DESC').all(userId).map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      is_read: Boolean(n.is_read),
      created_at: n.created_at,
    }));
  }

  static create({ user_id, title, message }) {
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO users_notification (user_id, title, message, is_read, created_at) VALUES (?, ?, ?, 0, ?)');
    const info = stmt.run(user_id, title, message, now);
    return db.prepare('SELECT * FROM users_notification WHERE id = ?').get(info.lastInsertRowid);
  }

  static markRead(id, userId) {
    return db.prepare('UPDATE users_notification SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, userId);
  }
}

module.exports = NotificationModel;
