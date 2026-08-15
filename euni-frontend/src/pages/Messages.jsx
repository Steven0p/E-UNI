import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';
import PageHeader from '../components/PageHeader';

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
    <div>
      <PageHeader eyebrow="Communication" title="Messages" />

      <ul className="divide-y divide-line border border-line bg-surface">
        {messages.map((m) => (
          <li key={m.id} className="px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              {m.expediteur_prenom} {m.expediteur_nom} <span className="mx-1">→</span> {m.destinataire_prenom}{' '}
              {m.destinataire_nom}
            </p>
            <p className="mt-1 text-sm text-ink">{m.contenu}</p>
          </li>
        ))}
        {messages.length === 0 && <li className="px-4 py-6 text-center text-sm text-ink-muted">Aucun message.</li>}
      </ul>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Nouveau message</h2>
        <form onSubmit={handleSend} className="flex flex-col gap-4 border border-line bg-surface p-5">
          {error && (
            <p className="border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
          )}
          <div>
            <label className="field-label" htmlFor="destinataire_id">
              ID du destinataire
            </label>
            <input
              id="destinataire_id"
              className="field-input"
              value={form.destinataire_id}
              onChange={(e) => setForm({ ...form, destinataire_id: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="contenu">
              Message
            </label>
            <textarea
              id="contenu"
              rows={3}
              className="field-input"
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              required
            />
          </div>
          <div>
            <button type="submit" className="btn-primary">
              Envoyer
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
