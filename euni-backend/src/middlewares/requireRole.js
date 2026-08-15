const ApiError = require('../utils/ApiError');

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Accès refusé pour ce rôle.'));
    }
    next();
  };
}

module.exports = requireRole;
