const { pool } = require('../config/db');
const hashToken = require('../utils/hashToken');

async function create(utilisateurId, token, expiresAt) {
  await pool.query(
    'INSERT INTO password_resets (utilisateur_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [utilisateurId, hashToken(token), expiresAt],
  );
}

async function findValid(token) {
  const [rows] = await pool.query(
    'SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()',
    [hashToken(token)],
  );
  return rows[0] || null;
}

async function markUsed(token) {
  await pool.query('UPDATE password_resets SET used_at = NOW() WHERE token_hash = ?', [hashToken(token)]);
}

module.exports = { create, findValid, markUsed };
