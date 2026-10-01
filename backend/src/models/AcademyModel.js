const db = require('../config/database');
const UserModel = require('./UserModel');
const { buildMediaUrl } = require('../utils/mediaUtils');

class AcademyModel {
  static findById(id) {
    return db.prepare('SELECT * FROM academy_academy WHERE id = ?').get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM academy_academy WHERE user_id = ?').get(userId);
  }

  static findFacilityPhotos(academyId, req) {
    const photos = db.prepare('SELECT image FROM academy_academyfacilityphoto WHERE academy_id = ?').all(academyId);
    return photos.map((p) => buildMediaUrl(req, p.image));
  }

  static findAll({ paid, district } = {}, req) {
    let query = `
      SELECT a.*, u.name as user_name, u.email as user_email, u.phone_number, u.gender
      FROM academy_academy a
      LEFT JOIN users_user u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (paid !== undefined && paid !== null) {
      query += ' AND a.paid = ?';
      params.push(paid ? 1 : 0);
    }
    if (district) {
      query += ' AND LOWER(a.district) = LOWER(?)';
      params.push(district);
    }

    query += ' ORDER BY a.id DESC';
    const rows = db.prepare(query).all(...params);

    return rows.map((r) => this.formatAcademy(r, req));
  }

  static create(data) {
    const fields = [
      'name', 'district', 'year_of_establishment', 'logo', 'office_address',
      'office_phone_number', 'email', 'website', 'no_of_players', 'coach_name',
      'coach_mobile', 'coach_email', 'coach_upha_id', 'coach_experience',
      'registration_certificate', 'transaction_id', 'transaction_image', 'paid',
      'director_id', 'user_id', 'academy_type', 'address_proof', 'bank_details',
      'categories_trained', 'coach_grade', 'discipline_focus',
      'pin_code', 'training_venue', 'trust_registration_number', 'coaches_employed'
    ];

    const placeholders = fields.map((f) => `@${f}`).join(', ');
    const sql = `INSERT INTO academy_academy (${fields.join(', ')}) VALUES (${placeholders})`;

    const params = {};
    for (const f of fields) {
      params[f] = data[f] !== undefined ? data[f] : null;
    }
    params.paid = data.paid ? 1 : 0;
    params.year_of_establishment = Number(data.year_of_establishment) || new Date().getFullYear();
    params.no_of_players = Number(data.no_of_players) || 0;
    params.coaches_employed = Number(data.coaches_employed) || 0;
    params.coach_experience = Number(data.coach_experience) || 0;

    const info = db.prepare(sql).run(params);
    const academyId = info.lastInsertRowid;

    if (Array.isArray(data.facility_photos)) {
      const photoStmt = db.prepare('INSERT INTO academy_academyfacilityphoto (image, academy_id) VALUES (?, ?)');
      for (const p of data.facility_photos) {
        if (p) photoStmt.run(p, academyId);
      }
    }

    return this.findById(academyId);
  }

  static updatePaymentStatus(id, paid) {
    return db.prepare('UPDATE academy_academy SET paid = ? WHERE id = ?').run(paid ? 1 : 0, id);
  }

  static formatAcademy(a, req) {
    if (!a) return null;
    let director = null;
    if (a.director_id) {
      director = UserModel.toSafeUser(UserModel.findById(a.director_id), req);
    } else if (a.user_id) {
      director = UserModel.toSafeUser(UserModel.findById(a.user_id), req);
    }

    return {
      id: a.id,
      name: a.name,
      district: a.district,
      year_of_establishment: a.year_of_establishment,
      logo: buildMediaUrl(req, a.logo),
      trust_registration_number: a.trust_registration_number,
      office_address: a.office_address,
      office_phone_number: a.office_phone_number,
      email: a.email,
      website: a.website,
      no_of_players: a.no_of_players,
      director,
      coach_name: a.coach_name,
      coach_mobile: a.coach_mobile,
      coach_email: a.coach_email,
      coach_upha_id: a.coach_upha_id,
      coach_experience: a.coach_experience,
      registration_certificate: buildMediaUrl(req, a.registration_certificate),
      transaction_id: a.transaction_id,
      transaction_image: buildMediaUrl(req, a.transaction_image),
      paid: Boolean(a.paid),
      academy_type: a.academy_type,
      discipline_focus: a.discipline_focus,
      categories_trained: a.categories_trained,
      coach_grade: a.coach_grade,
      pin_code: a.pin_code,
      training_venue: a.training_venue,
      coaches_employed: a.coaches_employed,
      address_proof: buildMediaUrl(req, a.address_proof),
      bank_details: a.bank_details,
      facility_photos: this.findFacilityPhotos(a.id, req),
    };
  }
}

module.exports = AcademyModel;
