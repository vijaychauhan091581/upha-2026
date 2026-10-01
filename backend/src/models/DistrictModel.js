const db = require('../config/database');
const UserModel = require('./UserModel');
const { buildMediaUrl } = require('../utils/mediaUtils');

class DistrictModel {
  static findById(id) {
    return db.prepare('SELECT * FROM district_district WHERE id = ?').get(id);
  }

  static findByUserId(userId) {
    return db.prepare('SELECT * FROM district_district WHERE user_id = ?').get(userId);
  }

  static findAll({ paid } = {}, req) {
    let query = 'SELECT * FROM district_district WHERE 1=1';
    const params = [];

    if (paid !== undefined && paid !== null) {
      query += ' AND paid = ?';
      params.push(paid ? 1 : 0);
    }

    query += ' ORDER BY id DESC';
    const rows = db.prepare(query).all(...params);

    return rows.map((r) => this.formatDistrict(r, req));
  }

  static create(data) {
    const fields = [
      'name', 'district', 'year_of_establishment', 'logo', 'office_address',
      'office_phone_number', 'email', 'website', 'no_of_players',
      'registration_certificate', 'transaction_id', 'transaction_image', 'paid',
      'adhyaksha_id', 'koshadhyaksha_id', 'sachiv_id', 'user_id', 'trust_registration_number'
    ];

    const placeholders = fields.map((f) => `@${f}`).join(', ');
    const sql = `INSERT INTO district_district (${fields.join(', ')}) VALUES (${placeholders})`;

    const params = {};
    for (const f of fields) {
      params[f] = data[f] !== undefined ? data[f] : null;
    }
    params.name = data.name || 'District Handball Association';
    params.district = data.district || data.name || 'UPHA Unit';
    params.logo = data.logo || '';
    params.office_address = data.office_address || '';
    params.office_phone_number = data.office_phone_number || '';
    params.email = data.email || '';
    params.transaction_id = data.transaction_id || `TXN-DIST-${Date.now()}`;
    params.transaction_image = data.transaction_image || '';
    params.paid = data.paid ? 1 : 0;
    params.year_of_establishment = Number(data.year_of_establishment) || new Date().getFullYear();
    params.no_of_players = Number(data.no_of_players) || 0;

    const info = db.prepare(sql).run(params);
    return this.findById(info.lastInsertRowid);
  }

  static updatePaymentStatus(id, paid) {
    return db.prepare('UPDATE district_district SET paid = ? WHERE id = ?').run(paid ? 1 : 0, id);
  }

  static formatDistrict(d, req) {
    if (!d) return null;
    return {
      id: d.id,
      name: d.name,
      district: d.district,
      year_of_establishment: d.year_of_establishment,
      logo: buildMediaUrl(req, d.logo),
      trust_registration_number: d.trust_registration_number,
      office_address: d.office_address,
      office_phone_number: d.office_phone_number,
      email: d.email,
      website: d.website,
      no_of_players: d.no_of_players,
      adhyaksha: d.adhyaksha_id ? UserModel.toSafeUser(UserModel.findById(d.adhyaksha_id), req) : null,
      sachiv: d.sachiv_id ? UserModel.toSafeUser(UserModel.findById(d.sachiv_id), req) : null,
      koshadhyaksha: d.koshadhyaksha_id ? UserModel.toSafeUser(UserModel.findById(d.koshadhyaksha_id), req) : null,
      registration_certificate: buildMediaUrl(req, d.registration_certificate),
      transaction_id: d.transaction_id,
      transaction_image: buildMediaUrl(req, d.transaction_image),
      paid: Boolean(d.paid),
    };
  }
}

module.exports = DistrictModel;
