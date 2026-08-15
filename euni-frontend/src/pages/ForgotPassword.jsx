import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Mot de passe oublié">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
        )}
        {message && (
          <p className="border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">{message}</p>
        )}
        <div>
          <label htmlFor="email" className="field-label">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
        </button>
        <Link to="/connexion" className="mt-2 text-sm text-accent hover:underline">
          Retour à la connexion
        </Link>
      </form>
    </AuthLayout>
  );
}
