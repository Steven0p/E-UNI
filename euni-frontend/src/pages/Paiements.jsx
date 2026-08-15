import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import paymentService from '../services/paymentService';

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
    <div className="page">
      <h1>Mes frais académiques</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {frais.map((f) => (
          <li key={f.id}>
            {f.libelle} — {f.montant} HTG — échéance {f.echeance} — statut : {f.statut}
            {f.statut !== 'paye' && (
              <button type="button" onClick={() => handlePayer(f.id)}>
                Payer avec MonCash
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
