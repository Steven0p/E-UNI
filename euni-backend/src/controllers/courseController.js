const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const courseModel = require('../models/courseModel');
const enrollmentModel = require('../models/enrollmentModel');

async function assertOwnerOrAdmin(req, cours) {
  if (req.user.role === 'admin') return;
  if (req.user.role === 'enseignant' && cours.enseignant_id === req.user.id) return;
  throw new ApiError(403, 'Vous ne gérez pas ce cours.');
}

const list = asyncHandler(async (req, res) => {
  const { programme_id: programmeId } = req.query;
  const cours = await courseModel.findAll({ programmeId });
  res.json(cours);
});

const getOne = asyncHandler(async (req, res) => {
  const cours = await courseModel.findById(req.params.id);
  if (!cours) throw new ApiError(404, 'Cours introuvable.');
  res.json(cours);
});

const create = asyncHandler(async (req, res) => {
  const {
    nom_cours: nomCours,
    programme_id: programmeId,
    enseignant_id: enseignantIdInput,
    credits,
    semestre,
    description,
  } = req.body;
  if (!nomCours || !programmeId) throw new ApiError(400, 'nom_cours et programme_id sont requis.');

  const enseignantId = req.user.role === 'enseignant' ? req.user.id : enseignantIdInput;
  const cours = await courseModel.create({ nomCours, programmeId, enseignantId, credits, semestre, description });
  res.status(201).json(cours);
});

const update = asyncHandler(async (req, res) => {
  const cours = await courseModel.findById(req.params.id);
  if (!cours) throw new ApiError(404, 'Cours introuvable.');
  await assertOwnerOrAdmin(req, cours);

  const updated = await courseModel.update(req.params.id, req.body);
  res.json(updated);
});

const remove = asyncHandler(async (req, res) => {
  const cours = await courseModel.findById(req.params.id);
  if (!cours) throw new ApiError(404, 'Cours introuvable.');
  await assertOwnerOrAdmin(req, cours);

  await courseModel.remove(req.params.id);
  res.status(204).send();
});

const listStudents = asyncHandler(async (req, res) => {
  const cours = await courseModel.findById(req.params.id);
  if (!cours) throw new ApiError(404, 'Cours introuvable.');

  const etudiants = await courseModel.listStudents(req.params.id);
  res.json(etudiants);
});

const enroll = asyncHandler(async (req, res) => {
  const cours = await courseModel.findById(req.params.id);
  if (!cours) throw new ApiError(404, 'Cours introuvable.');

  const alreadyEnrolled = await enrollmentModel.isEnrolled(req.user.id, req.params.id);
  if (alreadyEnrolled) throw new ApiError(409, 'Déjà inscrit à ce cours.');

  await enrollmentModel.enroll(req.user.id, req.params.id);
  res.status(201).json({ message: 'Inscription confirmée.' });
});

const myCourses = asyncHandler(async (req, res) => {
  const etudiantId = req.params.id;
  if (req.user.role === 'etudiant' && Number(etudiantId) !== req.user.id) {
    throw new ApiError(403, 'Accès refusé.');
  }

  const cours = await enrollmentModel.findByStudent(etudiantId);
  res.json(cours);
});

module.exports = { list, getOne, create, update, remove, listStudents, enroll, myCourses };
