const { pool } = require('../config/db');

async function upsert({ evaluationId, etudiantId, valeur }) {
  await pool.query(
    `INSERT INTO notes (evaluation_id, etudiant_id, valeur)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE valeur = VALUES(valeur), updated_at = NOW()`,
    [evaluationId, etudiantId, valeur],
  );
  const [rows] = await pool.query('SELECT * FROM notes WHERE evaluation_id = ? AND etudiant_id = ?', [
    evaluationId,
    etudiantId,
  ]);
  return rows[0];
}

async function findByStudent(etudiantId) {
  const [rows] = await pool.query(
    `SELECT n.valeur, e.titre, e.type, e.coefficient, e.date_evaluation, e.cours_id, c.nom_cours
     FROM notes n
     JOIN evaluations e ON e.id = n.evaluation_id
     JOIN cours c ON c.id = e.cours_id
     WHERE n.etudiant_id = ?
     ORDER BY c.nom_cours, e.date_evaluation`,
    [etudiantId],
  );
  return rows;
}

module.exports = { upsert, findByStudent };
