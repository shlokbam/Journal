import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, FlaskConical, ArrowRight, X, Command } from 'lucide-react';
import { searchApi } from '../../services/api';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ posts: [], experiments: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      searchApi.search('a').then(res => setResults(res));
    } else {
      searchApi.search(query).then(res => {
        setResults(res);
        setSelectedIndex(0);
      });
    }
  }, [query]);

  const allItems = [
    ...results.posts.map(p => ({ ...p, type: 'article', link: `/journal/${p.slug}` })),
    ...(results.experiments || []).map(e => ({ ...e, type: 'experiment', link: `/experiments` })),
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, allItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          navigate(allItems[selectedIndex].link);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-[#0D1117] border border-[#1D222B] rounded-xl shadow-2xl overflow-hidden z-10"
          >
            {/* Command Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#1D222B]">
              <Search className="w-5 h-5 text-[#9CA3AF] mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search articles & lab experiments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-[#F5F7FA] placeholder-[#6B7280] focus:outline-none text-sm font-sans"
              />
              <button
                onClick={onClose}
                className="p-1 rounded text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#11141A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#1D222B]/30">
              {allItems.length === 0 ? (
                <div className="py-12 text-center text-[#9CA3AF] font-mono text-sm">
                  No signals found matching "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {allItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={`${item.type}-${item.id || item.slug}`}
                        onClick={() => {
                          navigate(item.link);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#1D222B]/70 text-[#F5F7FA]' : 'text-[#9CA3AF] hover:bg-[#11141A]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.type === 'article' && <FileText className="w-4 h-4 text-[#6C8CFF] shrink-0" />}
                          {item.type === 'experiment' && <FlaskConical className="w-4 h-4 text-amber-400 shrink-0" />}

                          <div className="truncate">
                            <div className="text-sm font-medium text-[#F5F7FA] truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-[#6B7280] truncate font-mono">
                              {item.type.toUpperCase()} · {item.category || item.date}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected && <ArrowRight className="w-4 h-4 text-[#6C8CFF]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer help */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#08090B] border-t border-[#1D222B] text-[11px] font-mono text-[#6B7280]">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
