import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, motDePasse);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible.');
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Connexion à E-UNI</h1>
        {error && <p className="error">{error}</p>}
        <label htmlFor="email">
          E-mail
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label htmlFor="mot_de_passe">
          Mot de passe
          <input
            id="mot_de_passe"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </label>
        <button type="submit">Connexion</button>
        <p>
          Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
