const { pool } = require('../config/db');

async function findForUser(userId) {
  const [rows] = await pool.query('SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY created_at DESC', [
    userId,
  ]);
  return rows;
}

async function create({ utilisateurId, type, contenu }) {
  const [result] = await pool.query('INSERT INTO notifications (utilisateur_id, type, contenu) VALUES (?, ?, ?)', [
    utilisateurId,
    type,
    contenu,
  ]);
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
  return rows[0];
}

module.exports = { findForUser, create };
