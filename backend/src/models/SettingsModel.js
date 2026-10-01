const db = require('../config/database');
const { buildMediaUrl } = require('../utils/mediaUtils');
const { DEFAULT_FEES } = require('../config/constants');

class SettingsModel {
  static getSettings(req) {
    let settings = db.prepare('SELECT * FROM users_systemsettings LIMIT 1').get();

    if (!settings) {
      db.prepare(`
        INSERT INTO users_systemsettings (
          player_fee, referee_fee, coach_fee, academy_fee, district_fee,
          facebook_link, instagram_link, twitter_link, youtube_link,
          contact_email, contact_mobile, contact_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        DEFAULT_FEES.PLAYER, DEFAULT_FEES.REFEREE, DEFAULT_FEES.COACH,
        DEFAULT_FEES.ACADEMY, DEFAULT_FEES.DISTRICT,
        '', '', '', '', 'upha2024@gmail.com', '+91 8576878787', 'Lucknow, UP'
      );
      settings = db.prepare('SELECT * FROM users_systemsettings LIMIT 1').get();
    }

    return {
      payment_qr_code: buildMediaUrl(req, settings.payment_qr_code),
      player_fee: settings.player_fee,
      referee_fee: settings.referee_fee,
      coach_fee: settings.coach_fee,
      academy_fee: settings.academy_fee,
      district_fee: settings.district_fee,
      facebook_link: settings.facebook_link || '',
      instagram_link: settings.instagram_link || '',
      twitter_link: settings.twitter_link || '',
      youtube_link: settings.youtube_link || '',
      hai_affiliation_letter: buildMediaUrl(req, settings.hai_affiliation_letter),
      up_olympic_letter: buildMediaUrl(req, settings.up_olympic_letter),
      contact_email: settings.contact_email || '',
      contact_mobile: settings.contact_mobile || '',
      contact_address: settings.contact_address || '',
      auto_approve: Boolean(settings.auto_approve),
    };
  }

  static updateSettings(data) {
    const current = db.prepare('SELECT * FROM users_systemsettings LIMIT 1').get();
    if (!current) {
      this.getSettings(); // creates default
    }

    const fields = [
      'player_fee', 'referee_fee', 'coach_fee', 'academy_fee', 'district_fee',
      'facebook_link', 'instagram_link', 'twitter_link', 'youtube_link',
      'contact_email', 'contact_mobile', 'contact_address',
      'payment_qr_code', 'hai_affiliation_letter', 'up_olympic_letter',
      'auto_approve'
    ];

    const updates = [];
    const params = [];

    for (const f of fields) {
      if (data[f] !== undefined) {
        updates.push(`${f} = ?`);
        params.push(data[f]);
      }
    }

    if (updates.length > 0) {
      db.prepare(`UPDATE users_systemsettings SET ${updates.join(', ')} WHERE id = (SELECT id FROM users_systemsettings LIMIT 1)`).run(...params);
    }

    return this.getSettings();
  }
}

module.exports = SettingsModel;
