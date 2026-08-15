const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const programModel = require('../models/programModel');

const list = asyncHandler(async (req, res) => {
  const programmes = await programModel.findAll();
  res.json(programmes);
});

const create = asyncHandler(async (req, res) => {
  const { nom_programme: nomProgramme, description } = req.body;
  if (!nomProgramme) throw new ApiError(400, 'nom_programme est requis.');

  const programme = await programModel.create({ nomProgramme, description });
  res.status(201).json(programme);
});

module.exports = { list, create };
