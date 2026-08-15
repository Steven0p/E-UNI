import React from 'react';

const TONES = {
  neutral: 'bg-ink/5 text-ink-muted',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  accent: 'bg-accent-soft text-accent',
};

export default function Pill({ tone = 'neutral', children }) {
  return <span className={`pill ${TONES[tone]}`}>{children}</span>;
}
