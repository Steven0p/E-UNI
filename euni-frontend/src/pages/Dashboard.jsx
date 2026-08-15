import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import courseService from '../services/courseService';
import paymentService from '../services/paymentService';
import gradeService from '../services/gradeService';
import PageHeader from '../components/PageHeader';
import StatTile from '../components/StatTile';

export default function Dashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [cours, setCours] = useState([]);
  const [frais, setFrais] = useState([]);
  const [releve, setReleve] = useState([]);

  useEffect(() => {
    if (user.role === 'etudiant') {
      courseService.myCourses(user.id).then(setCours);
      paymentService.feesForStudent(user.id).then(setFrais);
      gradeService.releveForStudent(user.id).then(setReleve);
    } else if (user.role === 'enseignant') {
      courseService.list().then((all) => setCours(all.filter((c) => c.enseignant_id === user.id)));
    } else if (user.role === 'admin') {
      courseService.list().then(setCours);
    }
  }, [user]);

  const fraisDus = frais.filter((f) => f.statut !== 'paye');
  const nonLues = notifications.filter((n) => !n.lu);

  return (
    <div>
      <PageHeader
        eyebrow="Tableau de bord"
        title={`Bienvenue, ${user.prenom} ${user.nom}`}
        description={
          user.role === 'etudiant'
            ? "Vue d'ensemble de vos cours, frais et notes."
            : user.role === 'enseignant'
              ? 'Vue d\'ensemble de vos cours enseignés.'
              : "Vue d'ensemble de l'institution."
        }
      />

      {user.role === 'etudiant' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Cours inscrits" value={cours.length} />
            <StatTile label="Frais à payer" value={fraisDus.length} />
            <StatTile label="Notifications" value={nonLues.length} />
          </div>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Mes cours
            </h2>
            {cours.length === 0 ? (
              <p className="text-sm text-ink-muted">Aucun cours pour le moment.</p>
            ) : (
              <ul className="divide-y divide-line border border-line bg-surface">
                {cours.map((c) => (
                  <li key={c.id} className="px-4 py-3 text-sm text-ink">
                    {c.nom_cours}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Dernières notes
            </h2>
            {releve.length === 0 ? (
              <p className="text-sm text-ink-muted">Aucune note pour le moment.</p>
            ) : (
              <ul className="divide-y divide-line border border-line bg-surface">
                {releve.map((r) => (
                  <li key={r.cours_id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-ink">{r.nom_cours}</span>
                    <span className="font-mono text-ink-muted">{r.moyenne ?? '—'}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {user.role === 'enseignant' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Cours enseignés" value={cours.length} />
            <StatTile label="Notifications" value={nonLues.length} />
          </div>
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Mes cours
            </h2>
            <ul className="divide-y divide-line border border-line bg-surface">
              {cours.map((c) => (
                <li key={c.id} className="px-4 py-3 text-sm text-ink">
                  {c.nom_cours}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {user.role === 'admin' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Cours" value={cours.length} />
          <StatTile label="Notifications" value={nonLues.length} />
        </div>
      )}

      {nonLues.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Notifications récentes
          </h2>
          <ul className="divide-y divide-line border border-line bg-surface">
            {nonLues.slice(0, 5).map((n) => (
              <li key={n.id} className="px-4 py-3 text-sm text-ink">
                {n.contenu}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
