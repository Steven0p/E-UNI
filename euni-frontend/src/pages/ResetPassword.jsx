import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword({ token, mot_de_passe: motDePasse });
      setSuccess(true);
      setTimeout(() => navigate('/connexion'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Réinitialisation impossible.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Lien invalide">
        <p className="text-sm text-ink-muted">Aucun jeton de réinitialisation fourni.</p>
        <Link to="/mot-de-passe-oublie" className="mt-4 inline-block text-sm text-accent hover:underline">
          Demander un nouveau lien
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Réinitialiser le mot de passe">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
        )}
        {success && (
          <p className="border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
            Mot de passe mis à jour, redirection...
          </p>
        )}
        <div>
          <label htmlFor="mot_de_passe" className="field-label">
            Nouveau mot de passe
          </label>
          <input
            id="mot_de_passe"
            type="password"
            minLength={8}
            className="field-input"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Mise à jour...' : 'Réinitialiser'}
        </button>
      </form>
    </AuthLayout>
  );
}
