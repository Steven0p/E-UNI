import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Mot de passe oublié</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <label htmlFor="email">
          E-mail
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Envoyer le lien de réinitialisation</button>
        <p>
          <Link to="/connexion">Retour à la connexion</Link>
        </p>
      </form>
    </div>
  );
}
