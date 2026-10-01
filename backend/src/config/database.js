const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

const dbPath = process.env.DB_PATH
  ? path.resolve(__dirname, '../../', process.env.DB_PATH)
  : path.resolve(__dirname, '../../db.sqlite3');

console.log(`[Database] Connecting to SQLite database at: ${dbPath}`);

const db = new Database(dbPath, {
  fileMustExist: true,
  // verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

try {
  db.prepare('ALTER TABLE events_event ADD COLUMN image varchar(255) NULL').run();
} catch (e) {
  // column already exists
}

try {
  db.prepare('ALTER TABLE events_event ADD COLUMN venue varchar(255) NULL').run();
} catch (e) {
  // column already exists
}

try {
  db.prepare('ALTER TABLE users_systemsettings ADD COLUMN auto_approve INTEGER DEFAULT 0').run();
} catch (e) {
  // column already exists
}

try {
  db.prepare('ALTER TABLE users_referee ADD COLUMN certificate_image varchar(100) NULL').run();
} catch (e) {
  // column already exists
}

try {
  db.prepare('ALTER TABLE users_coach ADD COLUMN certificate_image varchar(100) NULL').run();
} catch (e) {
  // column already exists
}

try {
  const userTableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='users_user'").get()?.sql || '';
  if (userTableSql.includes('email" varchar(254) NOT NULL UNIQUE') || userTableSql.includes('username" varchar(150) NOT NULL UNIQUE')) {
    db.pragma('foreign_keys = OFF');
    db.exec(`
      CREATE TABLE IF NOT EXISTS users_user_dg_tmp (
        id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
        password varchar(128) NOT NULL,
        last_login datetime NULL,
        is_superuser bool NOT NULL DEFAULT 0,
        username varchar(150) NOT NULL,
        first_name varchar(150) NOT NULL DEFAULT '',
        last_name varchar(150) NOT NULL DEFAULT '',
        is_staff bool NOT NULL DEFAULT 0,
        is_active bool NOT NULL DEFAULT 1,
        date_joined datetime NOT NULL,
        email varchar(254) NOT NULL,
        name varchar(255) NOT NULL,
        father_name varchar(255) NOT NULL DEFAULT '',
        mother_name varchar(255) NOT NULL DEFAULT '',
        gender varchar(10) NOT NULL DEFAULT '',
        blood_group varchar(5) NOT NULL DEFAULT '',
        date_of_birth date NULL,
        phone_number varchar(20) NOT NULL DEFAULT '',
        adhar_number varchar(20) NULL,
        adhar_image varchar(100) NULL,
        passport_image varchar(100) NULL,
        role varchar(20) NOT NULL DEFAULT 'player',
        created_at datetime NOT NULL,
        valid_through datetime NULL
      );
      INSERT INTO users_user_dg_tmp SELECT id, password, last_login, is_superuser, username, first_name, last_name, is_staff, is_active, date_joined, email, name, father_name, mother_name, gender, blood_group, date_of_birth, phone_number, adhar_number, adhar_image, passport_image, role, created_at, valid_through FROM users_user;
      DROP TABLE users_user;
      ALTER TABLE users_user_dg_tmp RENAME TO users_user;
    `);
    db.pragma('foreign_keys = ON');
    console.log('[Database] Migrated users_user table to allow multiple registrations with same email.');
  }
} catch (e) {
  console.warn('[Database] users_user migration warning:', e.message);
  try { db.pragma('foreign_keys = ON'); } catch (_) {}
}

try {
  const refTableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='users_referee'").get()?.sql || '';
  if (refTableSql.includes('previous_referee_id" varchar(255) NOT NULL UNIQUE') || refTableSql.includes('transaction_id" varchar(255) NOT NULL UNIQUE')) {
    db.pragma('foreign_keys = OFF');
    db.exec(`
      CREATE TABLE IF NOT EXISTS users_referee_dg_tmp (
        id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
        district varchar(255) NOT NULL,
        occupation varchar(255) NOT NULL,
        grade_applying_for varchar(255) NOT NULL,
        year_of_officiating_experience integer NOT NULL,
        highest_level_officiated varchar(255) NOT NULL,
        tournament_officiated text NOT NULL,
        previous_referee_id varchar(255) NOT NULL,
        transaction_id varchar(255) NOT NULL,
        transaction_image varchar(100) NOT NULL,
        paid bool NOT NULL,
        user_id bigint NOT NULL,
        certificate_image varchar(100) NULL
      );
      INSERT INTO users_referee_dg_tmp (id, district, occupation, grade_applying_for, year_of_officiating_experience, highest_level_officiated, tournament_officiated, previous_referee_id, transaction_id, transaction_image, paid, user_id)
      SELECT id, district, occupation, grade_applying_for, year_of_officiating_experience, highest_level_officiated, tournament_officiated, previous_referee_id, transaction_id, transaction_image, paid, user_id FROM users_referee;
      DROP TABLE users_referee;
      ALTER TABLE users_referee_dg_tmp RENAME TO users_referee;
    `);
    db.pragma('foreign_keys = ON');
    console.log('[Database] Migrated users_referee table.');
  }
} catch (e) {
  console.warn('[Database] users_referee migration warning:', e.message);
  try { db.pragma('foreign_keys = ON'); } catch (_) {}
}

try {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      category TEXT DEFAULT 'general',
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
} catch (e) {
  console.warn('contact_messages table check:', e.message);
}

module.exports = db;
