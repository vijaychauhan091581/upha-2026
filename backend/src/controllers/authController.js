const UserModel = require('../models/UserModel');
const PlayerModel = require('../models/PlayerModel');
const CoachModel = require('../models/CoachModel');
const RefereeModel = require('../models/RefereeModel');
const AcademyModel = require('../models/AcademyModel');
const DistrictModel = require('../models/DistrictModel');
const { verifyPassword, hashPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../middleware/authMiddleware');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const user = UserModel.findByEmail(email) || UserModel.findByUsername(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isValid = verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      UserModel.updateLastLogin(user.id);
      const token = generateToken(user);

      // Set cookie compatible with browser and Next.js proxy
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('session_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res.cookie('sessionid', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const safeUser = UserModel.toSafeUser(user, req);
      return res.json({
        success: true,
        message: 'Logged in successfully.',
        user: safeUser,
        token,
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error during login.' });
    }
  }

  static async logout(req, res) {
    res.clearCookie('session_token');
    res.clearCookie('sessionid');
    return res.json({ success: true, message: 'Logged out successfully.' });
  }

  static async me(req, res) {
    try {
      if (!req.user) {
        return res.json({ success: false, message: 'Not authenticated.', user: null });
      }

      const user = req.user;
      let detailedProfile = null;

      if (user.role === 'player') {
        const player = PlayerModel.findByUserId(user.id);
        detailedProfile = PlayerModel.formatPlayer(player, user, req);
      } else if (user.role === 'coach') {
        const coach = CoachModel.findByUserId(user.id);
        detailedProfile = CoachModel.formatCoach(coach, user, req);
      } else if (user.role === 'referee') {
        const referee = RefereeModel.findByUserId(user.id);
        detailedProfile = RefereeModel.formatReferee(referee, user, req);
      } else if (user.role === 'academy') {
        const academy = AcademyModel.findByUserId(user.id);
        detailedProfile = AcademyModel.formatAcademy(academy, req);
      } else if (user.role === 'district') {
        const district = DistrictModel.findByUserId(user.id);
        detailedProfile = DistrictModel.formatDistrict(district, req);
      } else {
        detailedProfile = UserModel.toSafeUser(user, req);
      }

      return res.json({
        success: true,
        message: 'User profile retrieved.',
        user: detailedProfile || UserModel.toSafeUser(user, req),
      });
    } catch (err) {
      console.error('Me profile error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
    }
  }

  static async updateCredentials(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
      }

      const { current_password, new_password, new_email } = req.body;
      const user = UserModel.findById(req.user.id);

      const isValid = verifyPassword(current_password, user.password);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      if (new_password) {
        const hashed = hashPassword(new_password);
        UserModel.updatePassword(user.id, hashed);
      }

      if (new_email && new_email !== user.email) {
        const existing = UserModel.findByEmail(new_email);
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email already in use.' });
        }
        UserModel.updateEmail(user.id, new_email);
      }

      return res.json({ success: true, message: 'Credentials updated successfully.' });
    } catch (err) {
      console.error('Update credentials error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update credentials.' });
    }
  }

  static async registerAdmin(req, res) {
    try {
      const { email, password, name, phone_number, gender } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Email, password, and name are required.' });
      }

      if (UserModel.findByEmail(email)) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const hashedPassword = hashPassword(password);
      const newUser = UserModel.create({
        username: email,
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        phone_number: phone_number || '',
        gender: gender || '',
        is_staff: 1,
        is_superuser: 1,
      });

      return res.status(201).json({
        success: true,
        message: 'Admin registered successfully.',
        user: UserModel.toSafeUser(newUser, req),
      });
    } catch (err) {
      console.error('Register admin error:', err);
      return res.status(500).json({ success: false, message: 'Failed to register admin.' });
    }
  }

  static async inviteAdmin(req, res) {
    try {
      const { email, name, password } = req.body;
      if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Email and name are required.' });
      }

      if (UserModel.findByEmail(email)) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      }

      const autoPassword = password || `Admin@${Math.floor(1000 + Math.random() * 9000)}`;
      const hashedPassword = hashPassword(autoPassword);

      const newUser = UserModel.create({
        username: email,
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        is_staff: 1,
      });

      return res.status(201).json({
        success: true,
        message: 'Admin invited successfully.',
        credentials: {
          email: newUser.email,
          password: autoPassword,
          name: newUser.name,
        },
      });
    } catch (err) {
      console.error('Invite admin error:', err);
      return res.status(500).json({ success: false, message: 'Failed to invite admin.' });
    }
  }
}

module.exports = AuthController;
