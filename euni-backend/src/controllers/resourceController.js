const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const resourceModel = require('../models/resourceModel');

const list = asyncHandler(async (req, res) => {
  const { cours_id: coursId, q: motCle, categorie } = req.query;
  const ressources = await resourceModel.findAll({ coursId, motCle, categorie });
  res.json(ressources);
});

const create = asyncHandler(async (req, res) => {
  const { cours_id: coursId, titre, categorie, url } = req.body;
  if (!titre || !url) throw new ApiError(400, 'titre et url sont requis.');

  const ressource = await resourceModel.create({ coursId, titre, categorie, url, ajoutePar: req.user.id });
  res.status(201).json(ressource);
});

module.exports = { list, create };
