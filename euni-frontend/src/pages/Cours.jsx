import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';

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
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible.');
    }
  };

  return (
    <div className="page">
      <h1>Cours</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {cours.map((c) => (
          <li key={c.id}>
            <Link to={`/cours/${c.id}`}>{c.nom_cours}</Link> — {c.credits} crédits, {c.semestre}
            {user.role === 'etudiant' && (
              <button type="button" onClick={() => handleEnroll(c.id)}>
                S&apos;inscrire
              </button>
            )}
          </li>
        ))}
      </ul>

      {canManage && (
        <form onSubmit={handleCreate} className="inline-form">
          <h2>Créer un cours</h2>
          <input
            placeholder="Nom du cours"
            value={form.nom_cours}
            onChange={(e) => setForm({ ...form, nom_cours: e.target.value })}
            required
          />
          <select
            value={form.programme_id}
            onChange={(e) => setForm({ ...form, programme_id: e.target.value })}
            required
          >
            <option value="">Programme...</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom_programme}
              </option>
            ))}
          </select>
          <input
            placeholder="Crédits"
            type="number"
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: e.target.value })}
          />
          <input
            placeholder="Semestre"
            value={form.semestre}
            onChange={(e) => setForm({ ...form, semestre: e.target.value })}
          />
          <button type="submit">Créer</button>
        </form>
      )}
    </div>
  );
}
