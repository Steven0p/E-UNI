const { pool } = require('../config/db');

async function isEnrolled(etudiantId, coursId) {
  const [rows] = await pool.query(
    'SELECT id FROM inscriptions WHERE etudiant_id = ? AND cours_id = ?',
    [etudiantId, coursId],
  );
  return rows.length > 0;
}

async function enroll(etudiantId, coursId) {
  await pool.query('INSERT INTO inscriptions (etudiant_id, cours_id) VALUES (?, ?)', [etudiantId, coursId]);
}

async function findByStudent(etudiantId) {
  const [rows] = await pool.query(
    `SELECT c.* FROM inscriptions i JOIN cours c ON c.id = i.cours_id
     WHERE i.etudiant_id = ? ORDER BY c.nom_cours`,
    [etudiantId],
  );
  return rows;
}

module.exports = { isEnrolled, enroll, findByStudent };
