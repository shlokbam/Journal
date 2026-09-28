import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-90px 0px -50% 0px' }
    );

    const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (targetEl) {
      const yOffset = -95;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <nav className="space-y-3 font-mono text-xs">
      <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase pb-2 border-b border-[#1D222B] flex items-center justify-between">
        <span>ON THIS PAGE</span>
        <span className="text-[10px] text-[#6C8CFF] font-semibold">{headings.length} SECTIONS</span>
      </div>
      <ul className="space-y-1 relative">
        {headings.map((item, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const isActive = activeId === item.id;
          return (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`group relative flex items-center gap-2.5 transition-all duration-200 py-1.5 px-2 rounded-md ${
                  isActive
                    ? 'text-[#F5F7FA] font-semibold bg-[#111622] border border-[#6C8CFF]/40 shadow-[0_0_12px_rgba(108,140,255,0.15)]'
                    : 'text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#11141A]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="toc-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#6C8CFF] rounded-r shadow-[0_0_8px_#6C8CFF]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`text-[10px] font-mono ${isActive ? 'text-[#6C8CFF] font-bold' : 'text-[#6B7280]'}`}>
                  {num}
                </span>
                <span className="truncate">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
