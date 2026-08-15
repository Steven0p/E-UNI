const { pool } = require('../config/db');

async function create({ etudiantId, fraisId, orderId, montant }) {
  const [result] = await pool.query(
    `INSERT INTO paiements (etudiant_id, frais_id, order_id, montant, statut, mode_paiement)
     VALUES (?, ?, ?, ?, 'en_attente', 'moncash')`,
    [etudiantId, fraisId, orderId, montant],
  );
  return findById(result.insertId);
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM paiements WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findByOrderId(orderId) {
  const [rows] = await pool.query('SELECT * FROM paiements WHERE order_id = ?', [orderId]);
  return rows[0] || null;
}

async function findByReference(reference) {
  const [rows] = await pool.query('SELECT * FROM paiements WHERE reference_moncash = ? OR order_id = ?', [
    reference,
    reference,
  ]);
  return rows[0] || null;
}

async function updateStatus(id, { statut, referenceMoncash, datePaiement }) {
  await pool.query(
    `UPDATE paiements
     SET statut = ?, reference_moncash = COALESCE(?, reference_moncash), date_paiement = COALESCE(?, date_paiement)
     WHERE id = ?`,
    [statut, referenceMoncash || null, datePaiement || null, id],
  );
  return findById(id);
}

async function createManual({ etudiantId, fraisId, montant, valideParId }) {
  const orderId = `manuel-${Date.now()}-${etudiantId}`;
  const [result] = await pool.query(
    `INSERT INTO paiements (etudiant_id, frais_id, order_id, montant, statut, mode_paiement, valide_par, date_paiement)
     VALUES (?, ?, ?, ?, 'reussi', 'manuel', ?, NOW())`,
    [etudiantId, fraisId, orderId, montant, valideParId],
  );
  return findById(result.insertId);
}

module.exports = { create, findById, findByOrderId, findByReference, updateStatus, createManual };
