import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.register(form);
      setSuccess(true);
      setTimeout(() => navigate('/connexion'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Inscription impossible.');
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Créer un compte E-UNI</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Compte créé, redirection...</p>}
        <label htmlFor="prenom">
          Prénom
          <input id="prenom" name="prenom" value={form.prenom} onChange={handleChange} required />
        </label>
        <label htmlFor="nom">
          Nom
          <input id="nom" name="nom" value={form.nom} onChange={handleChange} required />
        </label>
        <label htmlFor="email">
          E-mail
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label htmlFor="mot_de_passe">
          Mot de passe
          <input
            id="mot_de_passe"
            type="password"
            name="mot_de_passe"
            minLength={8}
            value={form.mot_de_passe}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Créer le compte</button>
        <p>
          Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
