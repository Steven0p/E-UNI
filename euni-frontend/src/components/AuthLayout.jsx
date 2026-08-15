import React from 'react';

export default function AuthLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <div className="hidden w-1/2 flex-col justify-between bg-ink px-12 py-12 text-white lg:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Espace Numérique Universitaire
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold">E-UNI</p>
        </div>
        <div className="max-w-sm border-t border-white/10 pt-6 text-sm leading-relaxed text-white/65">
          Cours, notes, frais académiques et communication universitaire — centralisés dans un
          seul espace, pensé pour les institutions haïtiennes.
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <p className="mb-8 font-mono text-lg font-semibold text-ink lg:hidden">E-UNI</p>
          <h1 className="mb-8 text-2xl font-semibold text-ink">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
