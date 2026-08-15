import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ destinataire_id: '', contenu: '' });
  const [error, setError] = useState('');

  const load = () => messageService.forUser(user.id).then(setMessages);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await messageService.send(form);
      setForm({ destinataire_id: '', contenu: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Envoi impossible.');
    }
  };

  return (
    <div className="page">
      <h1>Messages</h1>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            <strong>
              {m.expediteur_prenom} {m.expediteur_nom}
            </strong>{' '}
            →{' '}
            <strong>
              {m.destinataire_prenom} {m.destinataire_nom}
            </strong>
            <p>{m.contenu}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSend} className="inline-form">
        <h2>Nouveau message</h2>
        {error && <p className="error">{error}</p>}
        <input
          placeholder="ID du destinataire"
          value={form.destinataire_id}
          onChange={(e) => setForm({ ...form, destinataire_id: e.target.value })}
          required
        />
        <textarea
          placeholder="Message"
          value={form.contenu}
          onChange={(e) => setForm({ ...form, contenu: e.target.value })}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}
