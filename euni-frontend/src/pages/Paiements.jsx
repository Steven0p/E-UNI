import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import paymentService from '../services/paymentService';
import PageHeader from '../components/PageHeader';
import Pill from '../components/Pill';
import { formatDate, formatMontant } from '../utils/format';

export default function Paiements() {
  const { user } = useAuth();
  const [frais, setFrais] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    paymentService.feesForStudent(user.id).then(setFrais);
  }, [user]);

  const handlePayer = async (fraisId) => {
    setError('');
    try {
      const { paymentUrl } = await paymentService.initier(fraisId);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Paiement impossible pour le moment.');
    }
  };

  return (
    <div>
      <PageHeader eyebrow="MonCash" title="Mes frais académiques" />
      {error && (
        <p className="mb-4 border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-medium">Frais</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Échéance</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {frais.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3 text-ink">{f.libelle}</td>
                <td className="px-4 py-3 font-mono text-ink">{formatMontant(f.montant)}</td>
                <td className="px-4 py-3 font-mono text-ink-muted">{formatDate(f.echeance)}</td>
                <td className="px-4 py-3">
                  <Pill tone={f.statut === 'paye' ? 'success' : 'warning'}>
                    {f.statut === 'paye' ? 'Payé' : 'Impayé'}
                  </Pill>
                </td>
                <td className="px-4 py-3 text-right">
                  {f.statut !== 'paye' && (
                    <button type="button" onClick={() => handlePayer(f.id)} className="text-xs text-accent hover:underline">
                      Payer avec MonCash
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {frais.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-muted">
                  Aucun frais enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
