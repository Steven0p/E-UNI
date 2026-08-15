const { pool } = require('../config/db');

async function findAll({ coursId, motCle, categorie } = {}) {
  const conditions = [];
  const params = [];

  if (coursId) {
    conditions.push('cours_id = ?');
    params.push(coursId);
  }
  if (categorie) {
    conditions.push('categorie = ?');
    params.push(categorie);
  }
  if (motCle) {
    conditions.push('titre LIKE ?');
    params.push(`%${motCle}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(`SELECT * FROM ressources ${where} ORDER BY created_at DESC`, params);
  return rows;
}

async function create({ coursId, titre, categorie, url, ajoutePar }) {
  const [result] = await pool.query(
    `INSERT INTO ressources (cours_id, titre, categorie, url, ajoute_par) VALUES (?, ?, ?, ?, ?)`,
    [coursId || null, titre, categorie || null, url, ajoutePar],
  );
  const [rows] = await pool.query('SELECT * FROM ressources WHERE id = ?', [result.insertId]);
  return rows[0];
}

module.exports = { findAll, create };
