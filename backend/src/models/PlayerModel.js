const db = require('../config/database');
const UserModel = require('./UserModel');
const { buildMediaUrl } = require('../utils/mediaUtils');

class PlayerModel {
  static findById(id) {
    return db.prepare('SELECT * FROM users_player WHERE id = ?').get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM users_player WHERE user_id = ?').get(userId);
  }

  static findFullPlayer(playerId, req) {
    const player = this.findById(playerId);
    if (!player) return null;
    const user = UserModel.findById(player.user_id);
    return this.formatPlayer(player, user, req);
  }

  static findAll({ paid, district, search } = {}, req) {
    let query = `
      SELECT p.*, u.name as user_name, u.email as user_email, u.phone_number, u.gender, u.father_name, u.mother_name, u.blood_group, u.date_of_birth, u.adhar_number, u.adhar_image, u.passport_image, u.created_at as user_created_at
      FROM users_player p
      JOIN users_user u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (paid !== undefined && paid !== null) {
      query += ' AND p.paid = ?';
      params.push(paid ? 1 : 0);
    }
    if (district) {
      query += ' AND LOWER(p.district) = LOWER(?)';
      params.push(district);
    }
    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ? OR p.transaction_id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY p.id DESC';
    const rows = db.prepare(query).all(...params);

    return rows.map((r) => ({
      id: r.id,
      district: r.district,
      dominant_hand: r.dominant_hand,
      club_name: r.club_name,
      school_name: r.school_name,
      coach_name: r.coach_name,
      height: r.height,
      weight: r.weight,
      transaction_id: r.transaction_id,
      transaction_image: buildMediaUrl(req, r.transaction_image),
      certificate_image: buildMediaUrl(req, r.certificate_image),
      paid: Boolean(r.paid),
      adhar_number: r.adhar_number,
      passport_image: buildMediaUrl(req, r.passport_image),
      adhar_image: buildMediaUrl(req, r.adhar_image),
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
        role: 'player',
      },
    }));
  }

  static create({
    user_id,
    district,
    dominant_hand = '',
    club_name = '',
    school_name = '',
    coach_name = '',
    height = 0,
    weight = 0,
    transaction_id,
    transaction_image,
    paid = 0,
    certificate_image = null,
  }) {
    const stmt = db.prepare(`
      INSERT INTO users_player (
        district, dominant_hand, club_name, school_name, coach_name,
        height, weight, transaction_id, transaction_image, paid,
        user_id, certificate_image
      ) VALUES (
        @district, @dominant_hand, @club_name, @school_name, @coach_name,
        @height, @weight, @transaction_id, @transaction_image, @paid,
        @user_id, @certificate_image
      )
    `);

    const info = stmt.run({
      district,
      dominant_hand,
      club_name,
      school_name,
      coach_name,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      transaction_id,
      transaction_image,
      paid: paid ? 1 : 0,
      user_id,
      certificate_image,
    });

    return this.findById(info.lastInsertRowid);
  }

  static updatePaymentStatus(id, paid) {
    return db.prepare('UPDATE users_player SET paid = ? WHERE id = ?').run(paid ? 1 : 0, id);
  }

  static uploadCertificate(id, certificate_image) {
    return db.prepare('UPDATE users_player SET certificate_image = ? WHERE id = ?').run(certificate_image, id);
  }

  static formatPlayer(player, user, req) {
    if (!player) return null;
    return {
      id: player.id,
      district: player.district,
      dominant_hand: player.dominant_hand,
      club_name: player.club_name,
      school_name: player.school_name,
      coach_name: player.coach_name,
      height: player.height,
      weight: player.weight,
      transaction_id: player.transaction_id,
      transaction_image: buildMediaUrl(req, player.transaction_image),
      certificate_image: buildMediaUrl(req, player.certificate_image),
      paid: Boolean(player.paid),
      adhar_number: user?.adhar_number || '',
      passport_image: buildMediaUrl(req, user?.passport_image),
      adhar_image: buildMediaUrl(req, user?.adhar_image),
      user: UserModel.toSafeUser(user, req),
    };
  }
}

module.exports = PlayerModel;
