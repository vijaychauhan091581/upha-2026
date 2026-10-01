const crypto = require('crypto');

/**
 * Validates a plaintext password against Django's stored pbkdf2_sha256 hash.
 */
function verifyPassword(password, encoded) {
  if (!password || !encoded) return false;
  const parts = encoded.split('$');
  if (parts.length !== 4) return false;

  const [algorithm, iterationsStr, salt, hash] = parts;
  if (algorithm !== 'pbkdf2_sha256') return false;

  const iterations = parseInt(iterationsStr, 10);
  if (isNaN(iterations) || iterations <= 0) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, iterations, 32, 'sha256')
    .toString('base64');

  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
}

/**
 * Creates a Django-compatible pbkdf2_sha256 password hash.
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(12).toString('base64');
  const iterations = 720000; // Standard Django iterations
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 32, 'sha256')
    .toString('base64');

  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

module.exports = {
  verifyPassword,
  hashPassword,
};
