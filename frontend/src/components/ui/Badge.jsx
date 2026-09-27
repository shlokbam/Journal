import React from 'react';

const TYPE_STYLES = {
  BUILD: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
  THINK: 'bg-purple-950/60 text-purple-400 border-purple-800/50',
  LEARN: 'bg-blue-950/60 text-blue-400 border-blue-800/50',
  EXPLORE: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
  INDUSTRY: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/50',
  DEFAULT: 'bg-zinc-900 text-zinc-400 border-zinc-800'
};

export function Badge({ children, type = 'DEFAULT', className = '' }) {
  const normalizedType = type?.toUpperCase();
  const style = TYPE_STYLES[normalizedType] || TYPE_STYLES.DEFAULT;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider rounded border ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {children}
    </span>
  );
}
