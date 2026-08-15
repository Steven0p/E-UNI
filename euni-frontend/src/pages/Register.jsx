import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(form);
      setSuccess(true);
      setTimeout(() => navigate('/connexion'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Créer un compte">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
        )}
        {success && (
          <p className="border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
            Compte créé, redirection...
          </p>
        )}
        <div>
          <label htmlFor="prenom" className="field-label">
            Prénom
          </label>
          <input id="prenom" name="prenom" className="field-input" value={form.prenom} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="nom" className="field-label">
            Nom
          </label>
          <input id="nom" name="nom" className="field-input" value={form.nom} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="field-input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="mot_de_passe" className="field-label">
            Mot de passe
          </label>
          <input
            id="mot_de_passe"
            type="password"
            name="mot_de_passe"
            minLength={8}
            className="field-input"
            value={form.mot_de_passe}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
        <p className="mt-6 border-t border-line pt-6 text-sm text-ink-muted">
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="text-accent hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
