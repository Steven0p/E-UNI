import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import PageHeader from '../components/PageHeader';

export default function Cours() {
  const { user } = useAuth();
  const [cours, setCours] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [form, setForm] = useState({ nom_cours: '', programme_id: '', credits: '', semestre: '' });
  const [error, setError] = useState('');

  const load = () => courseService.list().then(setCours);

  useEffect(() => {
    load();
    courseService.listProgrammes().then(setProgrammes);
  }, []);

  const canManage = user.role === 'enseignant' || user.role === 'admin';

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await courseService.create(form);
      setForm({ nom_cours: '', programme_id: '', credits: '', semestre: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Création impossible.');
    }
  };

  const handleEnroll = async (id) => {
    try {
      await courseService.enroll(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible.');
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Catalogue" title="Cours" />
      {error && (
        <p className="mb-4 border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-medium">Cours</th>
              <th className="px-4 py-3 font-medium">Crédits</th>
              <th className="px-4 py-3 font-medium">Semestre</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {cours.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <Link to={`/cours/${c.id}`} className="text-accent hover:underline">
                    {c.nom_cours}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-ink-muted">{c.credits}</td>
                <td className="px-4 py-3 text-ink-muted">{c.semestre || '—'}</td>
                <td className="px-4 py-3 text-right">
                  {user.role === 'etudiant' && (
                    <button type="button" onClick={() => handleEnroll(c.id)} className="text-xs text-accent hover:underline">
                      S&apos;inscrire
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {cours.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-muted">
                  Aucun cours pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {canManage && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Créer un cours
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 border border-line bg-surface p-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="nom_cours">
                Nom du cours
              </label>
              <input
                id="nom_cours"
                className="field-input"
                value={form.nom_cours}
                onChange={(e) => setForm({ ...form, nom_cours: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="programme_id">
                Programme
              </label>
              <select
                id="programme_id"
                className="field-input"
                value={form.programme_id}
                onChange={(e) => setForm({ ...form, programme_id: e.target.value })}
                required
              >
                <option value="">Choisir...</option>
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom_programme}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="credits">
                Crédits
              </label>
              <input
                id="credits"
                type="number"
                className="field-input"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="semestre">
                Semestre
              </label>
              <input
                id="semestre"
                className="field-input"
                value={form.semestre}
                onChange={(e) => setForm({ ...form, semestre: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Créer le cours
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
