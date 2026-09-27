import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Mail } from 'lucide-react';
import { Github, Linkedin } from '../ui/Icons';

export function Footer() {
  return (
    <footer className="w-full bg-[#08090B] border-t border-[#1D222B] mt-8 sm:mt-12 py-10 text-sm text-[#9CA3AF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-[#1D222B]">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-[#6C8CFF]" />
              <span className="font-mono text-base font-bold text-[#F5F7FA]">SHLOK.BAM</span>
            </Link>
            <p className="text-xs text-[#6B7280] max-w-sm">
              BUILD · THINK · EXPLORE — A personal engineering universe covering AI systems, software architecture, data pipelines, and research experiments.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <Link to="/journal" className="hover:text-[#F5F7FA] transition-colors">Journal</Link>
            <Link to="/experiments" className="hover:text-[#F5F7FA] transition-colors">Experiments</Link>
            <Link to="/about" className="hover:text-[#F5F7FA] transition-colors">About</Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#6B7280]">
          <div>
            © {new Date().getFullYear()} Shlok Bam. Designed with precision.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shlokbam"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5F7FA] transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/shlokbam"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5F7FA] transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a
              href="mailto:contact@shlokbam.dev"
              className="hover:text-[#F5F7FA] transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
