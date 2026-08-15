import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import gradeService from '../services/gradeService';
import PageHeader from '../components/PageHeader';
import { formatDate } from '../utils/format';

export default function CoursDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [cours, setCours] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [evalForm, setEvalForm] = useState({ titre: '', type: 'devoir', date_evaluation: '', coefficient: 1 });

  const canManage = user.role === 'admin' || (user.role === 'enseignant' && cours?.enseignant_id === user.id);

  useEffect(() => {
    courseService.getOne(id).then(setCours);
    gradeService.evaluationsForCourse(id).then(setEvaluations);
  }, [id]);

  useEffect(() => {
    if (canManage) courseService.listStudents(id).then(setEtudiants);
  }, [canManage, id]);

  const handleCreateEvaluation = async (e) => {
    e.preventDefault();
    await gradeService.createEvaluation({ ...evalForm, cours_id: id });
    gradeService.evaluationsForCourse(id).then(setEvaluations);
    setEvalForm({ titre: '', type: 'devoir', date_evaluation: '', coefficient: 1 });
  };

  const handleGrade = async (evaluationId, etudiantId, valeur) => {
    await gradeService.upsertGrade({ evaluation_id: evaluationId, etudiant_id: etudiantId, valeur });
  };

  if (!cours) return <p className="text-sm text-ink-muted">Chargement...</p>;

  return (
    <div>
      <PageHeader
        eyebrow={cours.enseignant_nom ? `${cours.enseignant_prenom} ${cours.enseignant_nom}` : 'Cours'}
        title={cours.nom_cours}
        description={cours.description}
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Évaluations</h2>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Coeff.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {evaluations.map((ev) => (
                <tr key={ev.id}>
                  <td className="px-4 py-3 text-ink">{ev.titre}</td>
                  <td className="px-4 py-3 text-ink-muted">{ev.type}</td>
                  <td className="px-4 py-3 font-mono text-ink-muted">{formatDate(ev.date_evaluation)}</td>
                  <td className="px-4 py-3 font-mono text-ink-muted">{ev.coefficient}</td>
                </tr>
              ))}
              {evaluations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-muted">
                    Aucune évaluation pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {canManage && (
        <>
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Saisir les notes
            </h2>
            <div className="overflow-x-auto border border-line bg-surface">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-3 font-medium">Étudiant</th>
                    {evaluations.map((ev) => (
                      <th key={ev.id} className="px-4 py-3 font-medium">
                        {ev.titre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {etudiants.map((et) => (
                    <tr key={et.id}>
                      <td className="px-4 py-3 text-ink">
                        {et.prenom} {et.nom}
                      </td>
                      {evaluations.map((ev) => (
                        <td key={ev.id} className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="—"
                            className="field-input w-20 font-mono"
                            onBlur={(e) => e.target.value && handleGrade(ev.id, et.id, Number(e.target.value))}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  {etudiants.length === 0 && (
                    <tr>
                      <td colSpan={evaluations.length + 1} className="px-4 py-6 text-center text-ink-muted">
                        Aucun étudiant inscrit.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Créer une évaluation
            </h2>
            <form
              onSubmit={handleCreateEvaluation}
              className="grid grid-cols-1 gap-4 border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div>
                <label className="field-label" htmlFor="titre">
                  Titre
                </label>
                <input
                  id="titre"
                  className="field-input"
                  value={evalForm.titre}
                  onChange={(e) => setEvalForm({ ...evalForm, titre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label" htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  className="field-input"
                  value={evalForm.type}
                  onChange={(e) => setEvalForm({ ...evalForm, type: e.target.value })}
                >
                  <option value="devoir">Devoir</option>
                  <option value="examen">Examen</option>
                  <option value="controle">Contrôle</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="date_evaluation">
                  Date
                </label>
                <input
                  id="date_evaluation"
                  type="date"
                  className="field-input"
                  value={evalForm.date_evaluation}
                  onChange={(e) => setEvalForm({ ...evalForm, date_evaluation: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label" htmlFor="coefficient">
                  Coefficient
                </label>
                <input
                  id="coefficient"
                  type="number"
                  step="0.1"
                  className="field-input"
                  value={evalForm.coefficient}
                  onChange={(e) => setEvalForm({ ...evalForm, coefficient: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <button type="submit" className="btn-primary">
                  Créer l&apos;évaluation
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
