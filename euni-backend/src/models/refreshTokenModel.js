const crypto = require('crypto');
const { pool } = require('../config/db');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function store(utilisateurId, token, expiresAt) {
  await pool.query(
    'INSERT INTO refresh_tokens (utilisateur_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [utilisateurId, hashToken(token), expiresAt],
  );
}

async function findValid(token) {
  const [rows] = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
    [hashToken(token)],
  );
  return rows[0] || null;
}

async function revoke(token) {
  await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [hashToken(token)]);
}

module.exports = { store, findValid, revoke };
