const path = require('path');
const SettingsModel = require('../models/SettingsModel');

function getRelativePath(file) {
  if (!file) return null;
  return path.relative(path.resolve(__dirname, '../../../backend/media'), file.path).replace(/\\/g, '/');
}

class SettingsController {
  static async getSettings(req, res) {
    try {
      const settings = SettingsModel.getSettings(req);
      return res.json({
        success: true,
        message: 'Settings retrieved',
        settings,
      });
    } catch (err) {
      console.error('Get settings error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve settings.' });
    }
  }

  static async updateSettings(req, res) {
    try {
      const b = req.body;
      const files = req.files || {};

      const data = { ...b };

      if (files.payment_qr_code) {
        data.payment_qr_code = getRelativePath(files.payment_qr_code[0]);
      }
      if (files.hai_affiliation_letter) {
        data.hai_affiliation_letter = getRelativePath(files.hai_affiliation_letter[0]);
      }
      if (files.up_olympic_letter) {
        data.up_olympic_letter = getRelativePath(files.up_olympic_letter[0]);
      }

      // Convert fees to numbers if present
      if (data.player_fee !== undefined) data.player_fee = Number(data.player_fee);
      if (data.referee_fee !== undefined) data.referee_fee = Number(data.referee_fee);
      if (data.coach_fee !== undefined) data.coach_fee = Number(data.coach_fee);
      if (data.academy_fee !== undefined) data.academy_fee = Number(data.academy_fee);
      if (data.district_fee !== undefined) data.district_fee = Number(data.district_fee);
      if (data.auto_approve !== undefined) {
        data.auto_approve = data.auto_approve === true || data.auto_approve === 'true' || data.auto_approve === 1 || data.auto_approve === '1' ? 1 : 0;
      }

      SettingsModel.updateSettings(data);
      const updated = SettingsModel.getSettings(req);

      return res.json({
        success: true,
        message: 'Settings updated successfully.',
        settings: updated,
      });
    } catch (err) {
      console.error('Update settings error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update settings.' });
    }
  }
}

module.exports = SettingsController;
