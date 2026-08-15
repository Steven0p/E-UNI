import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import resourceService from '../services/resourceService';
import PageHeader from '../components/PageHeader';

export default function Bibliotheque() {
  const { user } = useAuth();
  const [ressources, setRessources] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ titre: '', url: '', categorie: '', cours_id: '' });
  const [error, setError] = useState('');

  const load = (params) => resourceService.list(params).then(setRessources);

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load({ q });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await resourceService.create(form);
      setForm({ titre: '', url: '', categorie: '', cours_id: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Ajout impossible.');
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Ressources" title="Bibliothèque" />

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          className="field-input"
          placeholder="Rechercher par titre..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn-secondary shrink-0">
          Rechercher
        </button>
      </form>

      <ul className="divide-y divide-line border border-line bg-surface">
        {ressources.map((r) => (
          <li key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <a href={r.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              {r.titre}
            </a>
            {r.categorie && <span className="text-xs uppercase tracking-wide text-ink-muted">{r.categorie}</span>}
          </li>
        ))}
        {ressources.length === 0 && (
          <li className="px-4 py-6 text-center text-ink-muted">Aucune ressource trouvée.</li>
        )}
      </ul>

      {(user.role === 'enseignant' || user.role === 'admin') && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Ajouter une ressource
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 border border-line bg-surface p-5 sm:grid-cols-2">
            {error && (
              <p className="sm:col-span-2 border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}
            <div>
              <label className="field-label" htmlFor="titre">
                Titre
              </label>
              <input
                id="titre"
                className="field-input"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="url">
                URL
              </label>
              <input
                id="url"
                className="field-input"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="categorie">
                Catégorie
              </label>
              <input
                id="categorie"
                className="field-input"
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="cours_id">
                ID du cours (optionnel)
              </label>
              <input
                id="cours_id"
                className="field-input"
                value={form.cours_id}
                onChange={(e) => setForm({ ...form, cours_id: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Ajouter
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
