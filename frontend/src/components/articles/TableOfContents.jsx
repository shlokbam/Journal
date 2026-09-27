import React, { useState, useEffect } from 'react';

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
      { rootMargin: '-80px 0px -40% 0px' }
    );

    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    headingElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <nav className="space-y-3 font-mono text-xs">
      <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase pb-2 border-b border-[#1D222B]">
        ON THIS PAGE
      </div>
      <ul className="space-y-2">
        {headings.map((item, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const isActive = activeId === item.id;
          return (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
              <a
                href={`#${item.id}`}
                className={`flex items-center gap-2 transition-colors py-1 ${
                  isActive
                    ? 'text-[#6C8CFF] font-medium'
                    : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
                }`}
              >
                <span className="text-[#6B7280]">{num}</span>
                <span className="truncate">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
