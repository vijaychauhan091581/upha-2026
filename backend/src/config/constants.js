const path = require('path');

const MEDIA_ROOT = process.env.MEDIA_PATH
  ? path.resolve(__dirname, '../../', process.env.MEDIA_PATH)
  : path.resolve(__dirname, '../../media');

module.exports = {
  MEDIA_ROOT,
  ROLES: {
    ADMIN: 'admin',
    PLAYER: 'player',
    COACH: 'coach',
    REFEREE: 'referee',
    ACADEMY: 'academy',
    DISTRICT: 'district',
  },
  DEFAULT_FEES: {
    PLAYER: 111,
    REFEREE: 501,
    COACH: 1100,
    ACADEMY: 2100,
    DISTRICT: 2100,
  },
};
