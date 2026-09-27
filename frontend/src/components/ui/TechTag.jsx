import React from 'react';

export function TechTag({ children, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`inline-flex items-center px-2.5 py-1 text-xs font-mono rounded transition-colors ${
        active
          ? 'bg-[#6C8CFF]/20 text-[#6C8CFF] border border-[#6C8CFF]/40'
          : 'bg-[#11141A] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#1D222B] hover:border-[#2E3646]'
      }`}
    >
      #{children}
    </button>
  );
}
