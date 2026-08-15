import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import gradeService from '../services/gradeService';

export default function Notes() {
  const { user } = useAuth();
  const [releve, setReleve] = useState([]);

  useEffect(() => {
    if (user.role === 'etudiant') {
      gradeService.releveForStudent(user.id).then(setReleve);
    }
  }, [user]);

  if (user.role !== 'etudiant') {
    return (
      <div className="page">
        <h1>Notes</h1>
        <p>La saisie des notes se fait depuis la page de chaque cours.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Mes notes</h1>
      {releve.map((r) => (
        <section key={r.cours_id}>
          <h2>
            {r.nom_cours} — moyenne : {r.moyenne ?? '—'}
          </h2>
          <ul>
            {r.evaluations.map((ev, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={idx}>
                {ev.titre} ({ev.type}) : {ev.valeur} / coeff. {ev.coefficient}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
