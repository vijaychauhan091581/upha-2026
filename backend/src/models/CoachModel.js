const db = require('../config/database');
const UserModel = require('./UserModel');
const { buildMediaUrl } = require('../utils/mediaUtils');

class CoachModel {
  static findById(id) {
    return db.prepare('SELECT * FROM users_coach WHERE id = ?').get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM users_coach WHERE user_id = ?').get(userId);
  }

  static findAll({ paid, district } = {}, req) {
    let query = `
      SELECT c.*, u.name as user_name, u.email as user_email, u.phone_number, u.gender, u.father_name, u.mother_name, u.blood_group, u.date_of_birth, u.adhar_number, u.adhar_image, u.passport_image, u.created_at as user_created_at
      FROM users_coach c
      JOIN users_user u ON c.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (paid !== undefined && paid !== null) {
      query += ' AND c.paid = ?';
      params.push(paid ? 1 : 0);
    }
    if (district) {
      query += ' AND LOWER(c.district) = LOWER(?)';
      params.push(district);
    }

    query += ' ORDER BY c.id DESC';
    const rows = db.prepare(query).all(...params);

    return rows.map((r) => ({
      id: r.id,
      district: r.district,
      occupation: r.occupation,
      highest_coaching_grade: r.highest_coaching_grade,
      transaction_id: r.transaction_id,
      transaction_image: buildMediaUrl(req, r.transaction_image),
      paid: Boolean(r.paid),
      passport_image: buildMediaUrl(req, r.passport_image),
      user: {
        id: r.user_id,
        name: r.user_name,
        email: r.user_email,
        phone_number: r.phone_number,
        gender: r.gender,
        father_name: r.father_name,
        mother_name: r.mother_name,
        blood_group: r.blood_group,
        date_of_birth: r.date_of_birth,
        adhar_number: r.adhar_number,
        adhar_image: buildMediaUrl(req, r.adhar_image),
        passport_image: buildMediaUrl(req, r.passport_image),
        created_at: r.user_created_at,
        role: 'coach',
      },
    }));
  }

  static create({
    user_id,
    district,
    occupation = 'Handball Coach',
    highest_coaching_grade = 'Certified Coach',
    transaction_id = '',
    transaction_image = '',
    paid = 0,
  }) {
    const safeTxId = transaction_id || `ADMIN-CCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const safeTxImg = transaction_image || 'admin_approved.png';

    const stmt = db.prepare(`
      INSERT INTO users_coach (
        district, occupation, highest_coaching_grade,
        transaction_id, transaction_image, paid, user_id
      ) VALUES (
        @district, @occupation, @highest_coaching_grade,
        @transaction_id, @transaction_image, @paid, @user_id
      )
    `);

    const info = stmt.run({
      district,
      occupation,
      highest_coaching_grade,
      transaction_id: safeTxId,
      transaction_image: safeTxImg,
      paid: paid ? 1 : 0,
      user_id,
    });

    return this.findById(info.lastInsertRowid);
  }

  static updatePaymentStatus(id, paid) {
    return db.prepare('UPDATE users_coach SET paid = ? WHERE id = ?').run(paid ? 1 : 0, id);
  }

  static formatCoach(coach, user, req) {
    if (!coach) return null;
    const safeUser = UserModel.toSafeUser(user, req);
    return {
      id: coach.id,
      district: coach.district,
      occupation: coach.occupation,
      highest_coaching_grade: coach.highest_coaching_grade,
      transaction_id: coach.transaction_id,
      transaction_image: buildMediaUrl(req, coach.transaction_image),
      paid: Boolean(coach.paid),
      passport_image: safeUser?.passport_image || buildMediaUrl(req, user?.passport_image),
      user: safeUser,
    };
  }
}

module.exports = CoachModel;
