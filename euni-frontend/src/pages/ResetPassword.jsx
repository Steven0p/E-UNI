import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.resetPassword({ token, mot_de_passe: motDePasse });
      setSuccess(true);
      setTimeout(() => navigate('/connexion'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Réinitialisation impossible.');
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <h1>Lien invalide</h1>
          <p>Aucun jeton de réinitialisation fourni.</p>
          <Link to="/mot-de-passe-oublie">Demander un nouveau lien</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Réinitialiser le mot de passe</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Mot de passe mis à jour, redirection...</p>}
        <label htmlFor="mot_de_passe">
          Nouveau mot de passe
          <input
            id="mot_de_passe"
            type="password"
            minLength={8}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </label>
        <button type="submit">Réinitialiser</button>
      </form>
    </div>
  );
}
