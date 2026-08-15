import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const ROLE_LABELS = {
  etudiant: 'Étudiant',
  enseignant: 'Enseignant',
  admin: 'Administrateur',
};

const NAV_ITEMS = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/cours', label: 'Cours' },
  { to: '/notes', label: 'Notes' },
  { to: '/paiements', label: 'Paiements', roles: ['etudiant'] },
  { to: '/messages', label: 'Messages' },
  { to: '/bibliotheque', label: 'Bibliothèque' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const nonLues = notifications.filter((n) => !n.lu).length;

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between bg-ink text-white/90">
      <div>
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
            Espace Numérique Universitaire
          </p>
          <p className="mt-1 font-mono text-xl font-semibold text-white">E-UNI</p>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `border-l-2 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-accent bg-white/5 font-medium text-white'
                    : 'border-transparent text-white/65 hover:border-white/25 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mb-3 flex items-center justify-between text-xs text-white/60">
          <span>Notifications</span>
          <span className="font-mono text-white/80">{nonLues}</span>
        </div>
        <p className="text-sm font-medium text-white">
          {user.prenom} {user.nom}
        </p>
        <p className="text-xs uppercase tracking-wide text-white/50">{ROLE_LABELS[user.role]}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full border border-white/20 py-1.5 text-xs uppercase tracking-wide text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
