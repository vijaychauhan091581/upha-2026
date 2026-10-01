const AchievementModel = require('../models/AchievementModel');

class AchievementController {
  static async listAchievements(req, res) {
    try {
      const data = AchievementModel.getAllAchievements(req);
      return res.json({
        success: true,
        message: 'Achievements retrieved successfully',
        ...data,
      });
    } catch (err) {
      console.error('List achievements error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve achievements.' });
    }
  }

  static async manageMedals(req, res) {
    try {
      if (req.method === 'POST') {
        const medal = AchievementModel.addMedal(req.body);
        return res.status(201).json({ success: true, message: 'Medal created successfully', medal });
      } else if (req.method === 'PUT') {
        const medal = AchievementModel.updateMedal(req.body);
        return res.json({ success: true, message: 'Medal updated successfully', medal });
      } else if (req.method === 'DELETE') {
        const { id } = req.body;
        AchievementModel.deleteMedal(id);
        return res.json({ success: true, message: 'Medal deleted successfully' });
      }
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    } catch (err) {
      console.error('Manage medals error:', err);
      return res.status(500).json({ success: false, message: 'Failed to manage medals.' });
    }
  }

  static async managePlayers(req, res) {
    try {
      if (req.method === 'POST') {
        const player = AchievementModel.addPlayerAchievement(req.body);
        return res.status(201).json({ success: true, message: 'Player achievement created successfully', player });
      } else if (req.method === 'PUT') {
        const player = AchievementModel.updatePlayerAchievement(req.body);
        return res.json({ success: true, message: 'Player achievement updated successfully', player });
      } else if (req.method === 'DELETE') {
        const { id } = req.body;
        AchievementModel.deletePlayerAchievement(id);
        return res.json({ success: true, message: 'Player achievement deleted successfully' });
      }
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    } catch (err) {
      console.error('Manage player achievements error:', err);
      return res.status(500).json({ success: false, message: 'Failed to manage player achievement.' });
    }
  }

  static async manageCoaches(req, res) {
    try {
      if (req.method === 'POST') {
        const coach = AchievementModel.addCoachAchievement(req.body);
        return res.status(201).json({ success: true, message: 'Coach achievement created successfully', coach });
      } else if (req.method === 'PUT') {
        const coach = AchievementModel.updateCoachAchievement(req.body);
        return res.json({ success: true, message: 'Coach achievement updated successfully', coach });
      } else if (req.method === 'DELETE') {
        const { id } = req.body;
        AchievementModel.deleteCoachAchievement(id);
        return res.json({ success: true, message: 'Coach achievement deleted successfully' });
      }
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    } catch (err) {
      console.error('Manage coach achievements error:', err);
      return res.status(500).json({ success: false, message: 'Failed to manage coach achievement.' });
    }
  }

  static async manageAwards(req, res) {
    try {
      if (req.method === 'POST') {
        const award = AchievementModel.addAward(req.body);
        return res.status(201).json({ success: true, message: 'Federation award created successfully', award });
      } else if (req.method === 'PUT') {
        const award = AchievementModel.updateAward(req.body);
        return res.json({ success: true, message: 'Federation award updated successfully', award });
      } else if (req.method === 'DELETE') {
        const { id } = req.body;
        AchievementModel.deleteAward(id);
        return res.json({ success: true, message: 'Federation award deleted successfully' });
      }
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    } catch (err) {
      console.error('Manage awards error:', err);
      return res.status(500).json({ success: false, message: 'Failed to manage award.' });
    }
  }
}

module.exports = AchievementController;
