const { pool } = require('../config/db');

async function findAll({ programmeId } = {}) {
  const where = programmeId ? 'WHERE c.programme_id = ?' : '';
  const params = programmeId ? [programmeId] : [];
  const [rows] = await pool.query(
    `SELECT c.*, u.nom AS enseignant_nom, u.prenom AS enseignant_prenom
     FROM cours c LEFT JOIN utilisateurs u ON u.id = c.enseignant_id
     ${where} ORDER BY c.nom_cours`,
    params,
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT c.*, u.nom AS enseignant_nom, u.prenom AS enseignant_prenom
     FROM cours c LEFT JOIN utilisateurs u ON u.id = c.enseignant_id
     WHERE c.id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function create({ nomCours, programmeId, enseignantId, credits, semestre, description }) {
  const [result] = await pool.query(
    `INSERT INTO cours (nom_cours, programme_id, enseignant_id, credits, semestre, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nomCours, programmeId, enseignantId || null, credits || 0, semestre || null, description || null],
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const allowed = ['nom_cours', 'programme_id', 'enseignant_id', 'credits', 'semestre', 'description'];
  const keys = Object.keys(fields).filter((key) => allowed.includes(key));
  if (keys.length === 0) return findById(id);

  const setClause = keys.map((key) => `${key} = ?`).join(', ');
  const values = keys.map((key) => fields[key]);
  await pool.query(`UPDATE cours SET ${setClause} WHERE id = ?`, [...values, id]);
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM cours WHERE id = ?', [id]);
}

async function listStudents(coursId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.prenom, u.email, i.date_inscription
     FROM inscriptions i JOIN utilisateurs u ON u.id = i.etudiant_id
     WHERE i.cours_id = ? ORDER BY u.nom`,
    [coursId],
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, listStudents };
