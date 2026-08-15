const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const evaluationModel = require('../models/evaluationModel');
const courseModel = require('../models/courseModel');

async function assertTeachesCourse(req, coursId) {
  if (req.user.role === 'admin') return;

  const cours = await courseModel.findById(coursId);
  if (!cours) throw new ApiError(404, 'Cours introuvable.');
  if (req.user.role !== 'enseignant' || cours.enseignant_id !== req.user.id) {
    throw new ApiError(403, "Vous n'enseignez pas ce cours.");
  }
}

const listForCourse = asyncHandler(async (req, res) => {
  const evaluations = await evaluationModel.findByCourse(req.params.coursId);
  res.json(evaluations);
});

const create = asyncHandler(async (req, res) => {
  const { cours_id: coursId, titre, type, date_evaluation: dateEvaluation, coefficient } = req.body;
  if (!coursId || !titre || !dateEvaluation) {
    throw new ApiError(400, 'cours_id, titre et date_evaluation sont requis.');
  }
  await assertTeachesCourse(req, coursId);

  const evaluation = await evaluationModel.create({ coursId, titre, type, dateEvaluation, coefficient });
  res.status(201).json(evaluation);
});

module.exports = { listForCourse, create };
