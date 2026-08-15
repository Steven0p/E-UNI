import React from 'react';

export default function StatTile({ label, value }) {
  return (
    <div className="border border-line bg-surface px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
