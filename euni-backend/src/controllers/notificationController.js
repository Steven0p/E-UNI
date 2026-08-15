const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const notificationModel = require('../models/notificationModel');

const forUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (Number(userId) !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Accès refusé.');
  }

  const notifications = await notificationModel.findForUser(userId);
  res.json(notifications);
});

module.exports = { forUser };
