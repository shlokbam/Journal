import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Command, Menu, X, Terminal, Activity } from 'lucide-react';
import { Github } from '../ui/Icons';
import { CommandPalette } from './CommandPalette';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Journal', path: '/journal' },
    { name: 'Experiments', path: '/experiments' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-[#08090B]/85 backdrop-blur-md border-[#1D222B] shadow-lg shadow-black/20'
            : 'bg-[#08090B] border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#11141A] border border-[#1D222B] flex items-center justify-center text-[#6C8CFF] group-hover:border-[#6C8CFF]/50 transition-colors">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-mono text-base font-bold tracking-tight text-[#F5F7FA] group-hover:text-[#6C8CFF] transition-colors">
                SHLOK.BAM
              </span>
            </Link>

            {/* Operational Status Pulse */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#11141A] border border-[#1D222B] text-[10px] font-mono text-[#6B7280]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>API: 14ms • Operational</span>
            </div>
          </div>

          {/* Desktop Nav Links with Sliding Glide Pill */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-[#0D1117] border border-[#1D222B] rounded-xl relative">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1.5 text-xs font-mono font-medium transition-colors z-10 ${
                    isActive ? 'text-[#F5F7FA]' : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-glide-pill"
                      className="absolute inset-0 bg-[#161B26] border border-[#6C8CFF]/30 rounded-lg -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Cmd+K & GitHub) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#9CA3AF] bg-[#11141A] border border-[#1D222B] rounded-lg hover:border-[#6C8CFF]/40 hover:text-[#F5F7FA] transition-all duration-150"
            >
              <Command className="w-3.5 h-3.5 text-[#6C8CFF]" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[#08090B] border border-[#1D222B] rounded text-[#6B7280]">
                ⌘K
              </kbd>
            </button>

            <a
              href="https://github.com/shlokbam"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#9CA3AF] hover:text-[#F5F7FA] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub ↗</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="p-2 text-[#9CA3AF] hover:text-[#F5F7FA]"
            >
              <Command className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-[#9CA3AF] hover:text-[#F5F7FA]"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileOpen && (
          <div className="md:hidden border-b border-[#1D222B] bg-[#08090B] px-6 py-4 space-y-3 font-mono text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className="block py-2 text-[#9CA3AF] hover:text-[#6C8CFF]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Command Palette Search Modal */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </>
  );
}
