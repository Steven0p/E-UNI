const { pool } = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nom, prenom, email, role, created_at FROM utilisateurs WHERE id = ?',
    [id],
  );
  return rows[0] || null;
}

async function create({ nom, prenom, email, motDePasseHash, role }) {
  const [result] = await pool.query(
    'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
    [nom, prenom, email, motDePasseHash, role],
  );
  return findById(result.insertId);
}

module.exports = { findByEmail, findById, create };
