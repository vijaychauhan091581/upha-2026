const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'upha-jwt-secret-default';

function authenticate(required = true) {
  return (req, res, next) => {
    let token = null;

    if (req.cookies && (req.cookies.session_token || req.cookies.sessionid)) {
      token = req.cookies.session_token || req.cookies.sessionid;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      if (required) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = UserModel.findById(decoded.id);
      if (!user) {
        if (required) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = null;
        return next();
      }
      req.user = user;
      next();
    } catch (err) {
      if (required) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session' });
      }
      req.user = null;
      next();
    }
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

module.exports = {
  authenticate,
  generateToken,
};
