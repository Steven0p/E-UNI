const { pool } = require('../config/db');

async function findForUser(userId) {
  const [rows] = await pool.query(
    `SELECT m.*, ue.nom AS expediteur_nom, ue.prenom AS expediteur_prenom,
            ud.nom AS destinataire_nom, ud.prenom AS destinataire_prenom
     FROM messages m
     JOIN utilisateurs ue ON ue.id = m.expediteur_id
     JOIN utilisateurs ud ON ud.id = m.destinataire_id
     WHERE m.expediteur_id = ? OR m.destinataire_id = ?
     ORDER BY m.created_at DESC`,
    [userId, userId],
  );
  return rows;
}

async function create({ expediteurId, destinataireId, contenu }) {
  const [result] = await pool.query('INSERT INTO messages (expediteur_id, destinataire_id, contenu) VALUES (?, ?, ?)', [
    expediteurId,
    destinataireId,
    contenu,
  ]);
  const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  return rows[0];
}

module.exports = { findForUser, create };
