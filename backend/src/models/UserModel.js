const db = require('../config/database');
const { buildMediaUrl } = require('../utils/mediaUtils');

class UserModel {
  static findById(id) {
    return db.prepare('SELECT * FROM users_user WHERE id = ?').get(id);
  }

  static findByEmail(email) {
    if (!email) return null;
    return db.prepare('SELECT * FROM users_user WHERE LOWER(email) = LOWER(?) ORDER BY id DESC').get(email.trim());
  }

  static findAllByEmail(email) {
    if (!email) return [];
    return db.prepare('SELECT * FROM users_user WHERE LOWER(email) = LOWER(?) ORDER BY id DESC').all(email.trim());
  }

  static findByUsername(username) {
    if (!username) return null;
    return db.prepare('SELECT * FROM users_user WHERE LOWER(username) = LOWER(?) ORDER BY id DESC').get(username.trim());
  }

  static create({
    username,
    email,
    password,
    name,
    role = 'player',
    phone_number = '',
    gender = '',
    father_name = '',
    mother_name = '',
    blood_group = '',
    date_of_birth = null,
    adhar_number = null,
    adhar_image = null,
    passport_image = null,
    valid_through = null,
    is_staff = 0,
    is_superuser = 0,
    is_active = 1,
  }) {
    const now = new Date().toISOString();
    const safeAdhar = (adhar_number && String(adhar_number).trim() !== '') ? String(adhar_number).trim() : null;
    const finalUsername = username ? username.trim() : `${(email || 'user').trim()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const stmt = db.prepare(`
      INSERT INTO users_user (
        username, email, password, name, first_name, last_name, role,
        phone_number, gender, father_name, mother_name, blood_group,
        date_of_birth, adhar_number, adhar_image, passport_image,
        valid_through, is_staff, is_superuser, is_active, date_joined, created_at
      ) VALUES (
        @username, @email, @password, @name, @name, '', @role,
        @phone_number, @gender, @father_name, @mother_name, @blood_group,
        @date_of_birth, @adhar_number, @adhar_image, @passport_image,
        @valid_through, @is_staff, @is_superuser, @is_active, @now, @now
      )
    `);

    const info = stmt.run({
      username: finalUsername,
      email: (email || '').trim(),
      password,
      name,
      role,
      phone_number,
      gender,
      father_name,
      mother_name,
      blood_group,
      date_of_birth,
      adhar_number: safeAdhar,
      adhar_image,
      passport_image,
      valid_through,
      is_staff: is_staff ? 1 : 0,
      is_superuser: is_superuser ? 1 : 0,
      is_active: is_active ? 1 : 0,
      now,
    });

    return this.findById(info.lastInsertRowid);
  }

  static updatePassword(id, hashedPassword) {
    return db.prepare('UPDATE users_user SET password = ? WHERE id = ?').run(hashedPassword, id);
  }

  static updateEmail(id, newEmail) {
    return db.prepare('UPDATE users_user SET email = ? WHERE id = ?').run(newEmail, id);
  }

  static updateLastLogin(id) {
    return db.prepare('UPDATE users_user SET last_login = ? WHERE id = ?').run(new Date().toISOString(), id);
  }

  static toSafeUser(user, req) {
    if (!user) return null;
    const { password, ...safe } = user;
    return {
      ...safe,
      adhar_image: buildMediaUrl(req, safe.adhar_image),
      passport_image: buildMediaUrl(req, safe.passport_image),
    };
  }
}

module.exports = UserModel;
