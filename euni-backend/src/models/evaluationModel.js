const { pool } = require('../config/db');

async function findByCourse(coursId) {
  const [rows] = await pool.query('SELECT * FROM evaluations WHERE cours_id = ? ORDER BY date_evaluation', [coursId]);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM evaluations WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ coursId, titre, type, dateEvaluation, coefficient }) {
  const [result] = await pool.query(
    `INSERT INTO evaluations (cours_id, titre, type, date_evaluation, coefficient)
     VALUES (?, ?, ?, ?, ?)`,
    [coursId, titre, type || 'devoir', dateEvaluation, coefficient ?? 1],
  );
  return findById(result.insertId);
}

module.exports = { findByCourse, findById, create };
