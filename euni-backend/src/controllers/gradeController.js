const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const gradeModel = require('../models/gradeModel');
const evaluationModel = require('../models/evaluationModel');
const courseModel = require('../models/courseModel');
const notificationService = require('../services/notificationService');

const upsertGrade = asyncHandler(async (req, res) => {
  const { evaluation_id: evaluationId, etudiant_id: etudiantId, valeur } = req.body;
  if (!evaluationId || !etudiantId || valeur === undefined) {
    throw new ApiError(400, 'evaluation_id, etudiant_id et valeur sont requis.');
  }

  const evaluation = await evaluationModel.findById(evaluationId);
  if (!evaluation) throw new ApiError(404, 'Évaluation introuvable.');

  if (req.user.role !== 'admin') {
    const cours = await courseModel.findById(evaluation.cours_id);
    if (req.user.role !== 'enseignant' || cours.enseignant_id !== req.user.id) {
      throw new ApiError(403, "Vous n'enseignez pas ce cours.");
    }
  }

  const note = await gradeModel.upsert({ evaluationId, etudiantId, valeur });
  await notificationService.notify(etudiantId, 'note', `Nouvelle note disponible pour "${evaluation.titre}".`);

  res.status(201).json(note);
});

const forStudent = asyncHandler(async (req, res) => {
  const etudiantId = req.params.id;
  if (req.user.role === 'etudiant' && Number(etudiantId) !== req.user.id) {
    throw new ApiError(403, 'Accès refusé.');
  }

  const rows = await gradeModel.findByStudent(etudiantId);

  const parCours = {};
  for (const row of rows) {
    if (!parCours[row.cours_id]) {
      parCours[row.cours_id] = {
        cours_id: row.cours_id,
        nom_cours: row.nom_cours,
        evaluations: [],
        totalPondere: 0,
        totalCoefficients: 0,
      };
    }
    const entry = parCours[row.cours_id];
    entry.evaluations.push({
      titre: row.titre,
      type: row.type,
      coefficient: row.coefficient,
      date_evaluation: row.date_evaluation,
      valeur: row.valeur,
    });
    entry.totalPondere += Number(row.valeur) * Number(row.coefficient);
    entry.totalCoefficients += Number(row.coefficient);
  }

  const releve = Object.values(parCours).map((entry) => ({
    cours_id: entry.cours_id,
    nom_cours: entry.nom_cours,
    evaluations: entry.evaluations,
    moyenne: entry.totalCoefficients > 0 ? Number((entry.totalPondere / entry.totalCoefficients).toFixed(2)) : null,
  }));

  res.json(releve);
});

module.exports = { upsertGrade, forStudent };
