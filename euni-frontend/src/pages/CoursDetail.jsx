import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import gradeService from '../services/gradeService';

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

  if (!cours) return <p>Chargement...</p>;

  return (
    <div className="page">
      <h1>{cours.nom_cours}</h1>
      <p>{cours.description}</p>
      <p>Enseignant : {cours.enseignant_nom ? `${cours.enseignant_prenom} ${cours.enseignant_nom}` : '—'}</p>

      <h2>Évaluations</h2>
      <ul>
        {evaluations.map((ev) => (
          <li key={ev.id}>
            {ev.titre} ({ev.type}) — {ev.date_evaluation} — coeff. {ev.coefficient}
            {canManage && (
              <ul>
                {etudiants.map((et) => (
                  <li key={et.id}>
                    {et.prenom} {et.nom}
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Note"
                      onBlur={(e) => e.target.value && handleGrade(ev.id, et.id, Number(e.target.value))}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {canManage && (
        <form onSubmit={handleCreateEvaluation} className="inline-form">
          <h2>Créer une évaluation</h2>
          <input
            placeholder="Titre"
            value={evalForm.titre}
            onChange={(e) => setEvalForm({ ...evalForm, titre: e.target.value })}
            required
          />
          <select value={evalForm.type} onChange={(e) => setEvalForm({ ...evalForm, type: e.target.value })}>
            <option value="devoir">Devoir</option>
            <option value="examen">Examen</option>
            <option value="controle">Contrôle</option>
          </select>
          <input
            type="date"
            value={evalForm.date_evaluation}
            onChange={(e) => setEvalForm({ ...evalForm, date_evaluation: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.1"
            value={evalForm.coefficient}
            onChange={(e) => setEvalForm({ ...evalForm, coefficient: e.target.value })}
          />
          <button type="submit">Créer</button>
        </form>
      )}
    </div>
  );
}
