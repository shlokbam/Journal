import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Command, Menu, X, Terminal } from 'lucide-react';
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#11141A] border border-[#1D222B] flex items-center justify-center text-[#6C8CFF] group-hover:border-[#6C8CFF]/50 transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-mono text-base font-bold tracking-tight text-[#F5F7FA] group-hover:text-[#6C8CFF] transition-colors">
              SHLOK.BAM
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-[#F5F7FA] ${
                    isActive ? 'text-[#6C8CFF]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Cmd+K & GitHub) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#9CA3AF] bg-[#11141A] border border-[#1D222B] rounded-lg hover:border-[#2E3646] hover:text-[#F5F7FA] transition-colors"
            >
              <Command className="w-3.5 h-3.5" />
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
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-[#9CA3AF] hover:text-[#F5F7FA] focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileOpen && (
          <div className="md:hidden bg-[#0D1117] border-b border-[#1D222B] px-4 pt-4 pb-6 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    location.pathname.startsWith(link.path) ? 'text-[#6C8CFF]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#1D222B] flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  setIsCmdOpen(true);
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-mono text-[#9CA3AF] bg-[#11141A] border border-[#1D222B] rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Command className="w-4 h-4" /> Search Journal
                </span>
                <span className="text-xs text-[#6B7280]">⌘K</span>
              </button>

              <a
                href="https://github.com/shlokbam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-mono text-[#9CA3AF] hover:text-[#F5F7FA]"
              >
                <Github className="w-4 h-4" /> View GitHub Profile ↗
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </>
  );
}
