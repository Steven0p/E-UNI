import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import courseService from '../services/courseService';
import paymentService from '../services/paymentService';
import gradeService from '../services/gradeService';

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

  return (
    <div className="page">
      <h1>Tableau de bord</h1>
      <p>
        Bienvenue, {user.prenom} {user.nom}.
      </p>

      {user.role === 'etudiant' && (
        <>
          <section>
            <h2>Mes cours ({cours.length})</h2>
            <ul>
              {cours.map((c) => (
                <li key={c.id}>{c.nom_cours}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Frais à payer ({fraisDus.length})</h2>
            <ul>
              {fraisDus.map((f) => (
                <li key={f.id}>
                  {f.libelle} — {f.montant} HTG
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Dernières notes</h2>
            <ul>
              {releve.map((r) => (
                <li key={r.cours_id}>
                  {r.nom_cours} — moyenne : {r.moyenne ?? '—'}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {user.role === 'enseignant' && (
        <section>
          <h2>Mes cours enseignés ({cours.length})</h2>
          <ul>
            {cours.map((c) => (
              <li key={c.id}>{c.nom_cours}</li>
            ))}
          </ul>
        </section>
      )}

      {user.role === 'admin' && (
        <section>
          <h2>Vue d&apos;ensemble — {cours.length} cours</h2>
        </section>
      )}

      <section>
        <h2>Notifications ({notifications.filter((n) => !n.lu).length} non lues)</h2>
        <ul>
          {notifications.slice(0, 5).map((n) => (
            <li key={n.id}>{n.contenu}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
