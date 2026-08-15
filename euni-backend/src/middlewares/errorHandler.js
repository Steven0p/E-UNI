const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  console.error(err);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
}

module.exports = errorHandler;
