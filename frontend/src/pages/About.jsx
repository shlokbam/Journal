import React, { useState, useEffect } from 'react';
import { Mail, Terminal, Cpu, Globe, ExternalLink } from 'lucide-react';
import { Github, Linkedin } from '../components/ui/Icons';
import { profileApi } from '../services/api';
import { TechTag } from '../components/ui/TechTag';

export function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileApi.get().then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-6 pb-8 border-b border-[#1D222B]">
        <span className="text-xs font-mono text-[#6C8CFF] uppercase tracking-wider block">
          ABOUT // SHLOK BAM
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.1]">
          Building systems that turn complex problems into simple software.
        </h1>
        <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-2xl">
          {profile.bio}
        </p>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-mono">
          <a
            href={profile.portfolio_url || "https://portfolio-edaa.onrender.com/"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6C8CFF] text-[#08090B] font-bold hover:bg-[#8BA5FF] transition-all shadow-md"
          >
            <Globe className="w-4 h-4" /> Full Portfolio Site ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#11141A] border border-[#1D222B] text-[#F5F7FA] hover:border-[#6C8CFF]/50 transition-colors"
          >
            <Github className="w-4 h-4 text-[#6C8CFF]" /> GitHub Profile ↗
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#11141A] border border-[#1D222B] text-[#F5F7FA] hover:border-[#6C8CFF]/50 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-[#6C8CFF]" /> LinkedIn ↗
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6C8CFF]/10 border border-[#6C8CFF]/30 text-[#6C8CFF] hover:bg-[#6C8CFF]/20 transition-colors"
          >
            <Mail className="w-4 h-4" /> {profile.email}
          </a>
        </div>
      </div>

      {/* Redirect Portfolio Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D1117] via-[#111622] to-[#0D1117] border border-[#6C8CFF]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#6C8CFF] font-mono text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-4 h-4" /> Comprehensive Showcase & Resume
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Looking for all 17+ projects, hackathon achievements, certifications, and academic records?
          </p>
        </div>
        <a
          href={profile.portfolio_url || "https://portfolio-edaa.onrender.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg bg-[#6C8CFF] hover:bg-[#8BA5FF] text-[#08090B] font-bold text-xs font-mono transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          <span>Explore Complete Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Current Focus */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#F5F7FA] tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#6C8CFF]" /> Current Focus
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.current_focus.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0D1117] border border-[#1D222B] text-sm text-[#D1D5DB] flex items-start gap-3"
            >
              <span className="text-[#6C8CFF] font-mono font-bold">0{idx + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#F5F7FA] tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" /> Technology Stack
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-3">
            <h3 className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">LANGUAGES & CORE</h3>
            <div className="flex flex-wrap gap-2">
              {profile.tech_stack.languages.map(t => <TechTag key={t}>{t}</TechTag>)}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-3">
            <h3 className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">FRAMEWORKS & ORMS</h3>
            <div className="flex flex-wrap gap-2">
              {profile.tech_stack.frameworks.map(t => <TechTag key={t}>{t}</TechTag>)}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-3">
            <h3 className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">DATABASES & CLOUD</h3>
            <div className="flex flex-wrap gap-2">
              {profile.tech_stack.databases.map(t => <TechTag key={t}>{t}</TechTag>)}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-3">
            <h3 className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">INFRASTRUCTURE & DEVOPS</h3>
            <div className="flex flex-wrap gap-2">
              {profile.tech_stack.tools.map(t => <TechTag key={t}>{t}</TechTag>)}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#F5F7FA] tracking-tight">
          Experience & Projects Highlights
        </h2>
        <div className="space-y-4">
          {profile.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-base font-bold text-[#F5F7FA]">
                  {exp.role} <span className="text-[#6C8CFF]">@ {exp.company}</span>
                </h3>
                <span className="text-xs font-mono text-[#6B7280]">{exp.period}</span>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
