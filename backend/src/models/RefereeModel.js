const db = require('../config/database');
const UserModel = require('./UserModel');
const { buildMediaUrl } = require('../utils/mediaUtils');

class RefereeModel {
  static findById(id) {
    return db.prepare('SELECT * FROM users_referee WHERE id = ?').get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM users_referee WHERE user_id = ?').get(userId);
  }

  static findAll({ paid, district } = {}, req) {
    let query = `
      SELECT r.*, u.name as user_name, u.email as user_email, u.phone_number, u.gender, u.father_name, u.mother_name, u.blood_group, u.date_of_birth, u.adhar_number, u.adhar_image, u.passport_image, u.created_at as user_created_at
      FROM users_referee r
      JOIN users_user u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (paid !== undefined && paid !== null) {
      query += ' AND r.paid = ?';
      params.push(paid ? 1 : 0);
    }
    if (district) {
      query += ' AND LOWER(r.district) = LOWER(?)';
      params.push(district);
    }

    query += ' ORDER BY r.id DESC';
    const rows = db.prepare(query).all(...params);

    return rows.map((r) => ({
      id: r.id,
      district: r.district,
      occupation: r.occupation,
      grade_applying_for: r.grade_applying_for,
      year_of_officiating_experience: r.year_of_officiating_experience,
      highest_level_officiated: r.highest_level_officiated,
      tournament_officiated: r.tournament_officiated,
      previous_referee_id: r.previous_referee_id,
      transaction_id: r.transaction_id,
      transaction_image: buildMediaUrl(req, r.transaction_image),
      paid: Boolean(r.paid),
      passport_image: buildMediaUrl(req, r.passport_image),
      adhar_number: r.adhar_number,
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
        role: 'referee',
      },
    }));
  }

  static create({
    user_id,
    district,
    occupation = 'Match Official',
    grade_applying_for = 'State',
    year_of_officiating_experience = 1,
    highest_level_officiated = 'State Level',
    tournament_officiated = 'UPHA Tournaments',
    previous_referee_id = '',
    transaction_id = '',
    transaction_image = '',
    paid = 0,
    certificate_image = null,
  }) {
    const safeTxId = transaction_id || `ADMIN-REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const safePrevId = previous_referee_id || `REF-ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const safeTxImg = transaction_image || 'admin_approved.png';

    const stmt = db.prepare(`
      INSERT INTO users_referee (
        district, occupation, grade_applying_for, year_of_officiating_experience,
        highest_level_officiated, tournament_officiated, previous_referee_id,
        transaction_id, transaction_image, paid, user_id, certificate_image
      ) VALUES (
        @district, @occupation, @grade_applying_for, @year_of_officiating_experience,
        @highest_level_officiated, @tournament_officiated, @previous_referee_id,
        @transaction_id, @transaction_image, @paid, @user_id, @certificate_image
      )
    `);

    const info = stmt.run({
      district,
      occupation: occupation || 'Match Official',
      grade_applying_for: grade_applying_for || 'State',
      year_of_officiating_experience: Number(year_of_officiating_experience) || 0,
      highest_level_officiated: highest_level_officiated || 'State Level',
      tournament_officiated: tournament_officiated || 'UPHA Tournaments',
      previous_referee_id: safePrevId,
      transaction_id: safeTxId,
      transaction_image: safeTxImg,
      paid: paid ? 1 : 0,
      user_id,
      certificate_image,
    });

    return this.findById(info.lastInsertRowid);
  }

  static updatePaymentStatus(id, paid) {
    return db.prepare('UPDATE users_referee SET paid = ? WHERE id = ?').run(paid ? 1 : 0, id);
  }

  static formatReferee(referee, user, req) {
    if (!referee) return null;
    const safeUser = UserModel.toSafeUser(user, req);
    return {
      id: referee.id,
      district: referee.district,
      occupation: referee.occupation,
      grade_applying_for: referee.grade_applying_for,
      year_of_officiating_experience: referee.year_of_officiating_experience,
      highest_level_officiated: referee.highest_level_officiated,
      tournament_officiated: referee.tournament_officiated,
      previous_referee_id: referee.previous_referee_id,
      transaction_id: referee.transaction_id,
      transaction_image: buildMediaUrl(req, referee.transaction_image),
      certificate_image: buildMediaUrl(req, referee.certificate_image),
      paid: Boolean(referee.paid),
      passport_image: safeUser?.passport_image || buildMediaUrl(req, user?.passport_image),
      adhar_number: safeUser?.adhar_number || user?.adhar_number || '',
      user: safeUser,
    };
  }
}

module.exports = RefereeModel;
