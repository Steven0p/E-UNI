import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import gradeService from '../services/gradeService';
import PageHeader from '../components/PageHeader';
import { formatDate } from '../utils/format';

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
      <div>
        <PageHeader eyebrow="Relevé" title="Notes" />
        <p className="text-sm text-ink-muted">La saisie des notes se fait depuis la page de chaque cours.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Relevé" title="Mes notes" />
      {releve.length === 0 && <p className="text-sm text-ink-muted">Aucune note pour le moment.</p>}
      {releve.map((r) => (
        <section key={r.cours_id} className="mb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{r.nom_cours}</h2>
            <span className="font-mono text-lg font-semibold text-ink">{r.moyenne ?? '—'}</span>
          </div>
          <div className="overflow-x-auto border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3 font-medium">Évaluation</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Coeff.</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {r.evaluations.map((ev, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr key={idx}>
                    <td className="px-4 py-3 text-ink">{ev.titre}</td>
                    <td className="px-4 py-3 text-ink-muted">{ev.type}</td>
                    <td className="px-4 py-3 font-mono text-ink-muted">{formatDate(ev.date_evaluation)}</td>
                    <td className="px-4 py-3 font-mono text-ink-muted">{ev.coefficient}</td>
                    <td className="px-4 py-3 font-mono font-medium text-ink">{ev.valeur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
