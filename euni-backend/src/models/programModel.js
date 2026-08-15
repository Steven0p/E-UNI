const { pool } = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM programmes ORDER BY nom_programme');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM programmes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nomProgramme, description }) {
  const [result] = await pool.query(
    'INSERT INTO programmes (nom_programme, description) VALUES (?, ?)',
    [nomProgramme, description || null],
  );
  return findById(result.insertId);
}

module.exports = { findAll, findById, create };
