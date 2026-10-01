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
