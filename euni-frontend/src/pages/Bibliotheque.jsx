import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import resourceService from '../services/resourceService';

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
    <div className="page">
      <h1>Bibliothèque</h1>
      <form onSubmit={handleSearch} className="inline-form">
        <input placeholder="Rechercher..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit">Rechercher</button>
      </form>

      <ul>
        {ressources.map((r) => (
          <li key={r.id}>
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.titre}
            </a>{' '}
            {r.categorie && `(${r.categorie})`}
          </li>
        ))}
      </ul>

      {(user.role === 'enseignant' || user.role === 'admin') && (
        <form onSubmit={handleAdd} className="inline-form">
          <h2>Ajouter une ressource</h2>
          {error && <p className="error">{error}</p>}
          <input
            placeholder="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            required
          />
          <input
            placeholder="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <input
            placeholder="Catégorie"
            value={form.categorie}
            onChange={(e) => setForm({ ...form, categorie: e.target.value })}
          />
          <input
            placeholder="ID du cours (optionnel)"
            value={form.cours_id}
            onChange={(e) => setForm({ ...form, cours_id: e.target.value })}
          />
          <button type="submit">Ajouter</button>
        </form>
      )}
    </div>
  );
}
