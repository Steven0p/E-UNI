const notificationModel = require('../models/notificationModel');

async function notify(utilisateurId, type, contenu) {
  return notificationModel.create({ utilisateurId, type, contenu });
}

module.exports = { notify };
