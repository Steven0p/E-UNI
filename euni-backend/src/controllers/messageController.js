const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const messageModel = require('../models/messageModel');
const notificationService = require('../services/notificationService');

const forUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (Number(userId) !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Accès refusé.');
  }

  const messages = await messageModel.findForUser(userId);
  res.json(messages);
});

const send = asyncHandler(async (req, res) => {
  const { destinataire_id: destinataireId, contenu } = req.body;
  if (!destinataireId || !contenu) throw new ApiError(400, 'destinataire_id et contenu sont requis.');

  const message = await messageModel.create({ expediteurId: req.user.id, destinataireId, contenu });
  await notificationService.notify(destinataireId, 'message', 'Vous avez reçu un nouveau message.');

  res.status(201).json(message);
});

module.exports = { forUser, send };
