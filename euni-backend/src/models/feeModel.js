const { pool } = require('../config/db');

async function findByStudent(etudiantId) {
  const [rows] = await pool.query('SELECT * FROM frais_academiques WHERE etudiant_id = ? ORDER BY echeance', [
    etudiantId,
  ]);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM frais_academiques WHERE id = ?', [id]);
  return rows[0] || null;
}

async function markPaid(id) {
  await pool.query("UPDATE frais_academiques SET statut = 'paye' WHERE id = ?", [id]);
}

module.exports = { findByStudent, findById, markPaid };
