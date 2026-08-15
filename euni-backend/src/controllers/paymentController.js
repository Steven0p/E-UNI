const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const feeModel = require('../models/feeModel');
const paymentModel = require('../models/paymentModel');
const moncashService = require('../services/moncashService');
const notificationService = require('../services/notificationService');

const listFeesForStudent = asyncHandler(async (req, res) => {
  const etudiantId = req.params.id;
  if (req.user.role === 'etudiant' && Number(etudiantId) !== req.user.id) {
    throw new ApiError(403, 'Accès refusé.');
  }

  const frais = await feeModel.findByStudent(etudiantId);
  res.json(frais);
});

const initierPaiement = asyncHandler(async (req, res) => {
  const { frais_id: fraisId } = req.body;
  if (!fraisId) throw new ApiError(400, 'frais_id est requis.');

  const frais = await feeModel.findById(fraisId);
  if (!frais) throw new ApiError(404, 'Frais introuvable.');
  if (frais.etudiant_id !== req.user.id) throw new ApiError(403, "Ce frais n'appartient pas à cet étudiant.");
  if (frais.statut === 'paye') throw new ApiError(409, 'Ce frais est déjà payé.');

  const orderId = `euni-${frais.id}-${Date.now()}`;
  const paiement = await paymentModel.create({
    etudiantId: req.user.id,
    fraisId: frais.id,
    orderId,
    montant: frais.montant,
  });

  const { paymentUrl } = await moncashService.createPayment({ orderId, amount: Number(frais.montant) });

  res.status(201).json({ paiement, paymentUrl });
});

// Le statut n'est jamais accepté tel quel depuis le webhook ou le client : on interroge
// systématiquement MonCash côté serveur avant de marquer un paiement comme réussi (RNF-7).
async function confirmerSiReussi(paiement) {
  const transaction = await moncashService.retrieveTransaction({ orderId: paiement.order_id });
  if (!transaction) throw new ApiError(404, 'Transaction MonCash introuvable.');

  const statut = transaction.message === 'successful' ? 'reussi' : 'echoue';
  const updated = await paymentModel.updateStatus(paiement.id, {
    statut,
    referenceMoncash: transaction.reference,
    datePaiement: statut === 'reussi' ? new Date() : null,
  });

  if (statut === 'reussi') {
    await feeModel.markPaid(paiement.frais_id);
    await notificationService.notify(paiement.etudiant_id, 'paiement', 'Votre paiement a été confirmé.');
  }

  return updated;
}

const verifierPaiement = asyncHandler(async (req, res) => {
  const paiement = await paymentModel.findByReference(req.params.reference);
  if (!paiement) throw new ApiError(404, 'Paiement introuvable.');
  if (req.user.role !== 'admin' && paiement.etudiant_id !== req.user.id) {
    throw new ApiError(403, 'Accès refusé.');
  }

  const updated = paiement.statut === 'en_attente' ? await confirmerSiReussi(paiement) : paiement;
  res.json(updated);
});

const webhook = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) throw new ApiError(400, 'orderId manquant.');

  const paiement = await paymentModel.findByOrderId(orderId);
  if (!paiement) throw new ApiError(404, 'Paiement introuvable.');

  if (paiement.statut === 'en_attente') {
    await confirmerSiReussi(paiement);
  }

  res.status(200).json({ received: true });
});

const payerManuellement = asyncHandler(async (req, res) => {
  const { frais_id: fraisId } = req.body;
  if (!fraisId) throw new ApiError(400, 'frais_id est requis.');

  const frais = await feeModel.findById(fraisId);
  if (!frais) throw new ApiError(404, 'Frais introuvable.');
  if (frais.statut === 'paye') throw new ApiError(409, 'Ce frais est déjà payé.');

  const paiement = await paymentModel.createManual({
    etudiantId: frais.etudiant_id,
    fraisId: frais.id,
    montant: frais.montant,
    valideParId: req.user.id,
  });
  await feeModel.markPaid(frais.id);
  await notificationService.notify(
    frais.etudiant_id,
    'paiement',
    "Votre paiement a été enregistré manuellement par l'administration.",
  );

  res.status(201).json(paiement);
});

module.exports = { listFeesForStudent, initierPaiement, verifierPaiement, webhook, payerManuellement };
