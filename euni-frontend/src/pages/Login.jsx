import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, motDePasse);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Connexion">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
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
        <div>
          <label htmlFor="mot_de_passe" className="field-label">
            Mot de passe
          </label>
          <input
            id="mot_de_passe"
            type="password"
            className="field-input"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Connexion...' : 'Connexion'}
        </button>
        <Link to="/mot-de-passe-oublie" className="text-sm text-accent hover:underline">
          Mot de passe oublié ?
        </Link>
        <p className="mt-6 border-t border-line pt-6 text-sm text-ink-muted">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-accent hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
