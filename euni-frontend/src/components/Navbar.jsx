import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const nonLues = notifications.filter((n) => !n.lu).length;

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">E-UNI</div>
      <div className="navbar-links">
        <Link to="/">Tableau de bord</Link>
        <Link to="/cours">Cours</Link>
        <Link to="/notes">Notes</Link>
        {user.role === 'etudiant' && <Link to="/paiements">Paiements</Link>}
        <Link to="/messages">Messages</Link>
        <Link to="/bibliotheque">Bibliothèque</Link>
      </div>
      <div className="navbar-user">
        <span>
          Notifications : {nonLues} · {user.prenom} {user.nom} ({user.role})
        </span>
        <button type="button" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
