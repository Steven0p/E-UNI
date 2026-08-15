import React from 'react';

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="text-xs uppercase tracking-wide text-accent">{eyebrow}</p>}
      <h1 className="mt-1 text-2xl font-semibold text-ink">{title}</h1>
      {description && <p className="mt-2 text-sm text-ink-muted">{description}</p>}
    </header>
  );
}
