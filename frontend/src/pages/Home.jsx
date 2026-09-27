import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, ChevronRight } from 'lucide-react';
import { postsApi, experimentsApi } from '../services/api';
import { ArticleCard } from '../components/articles/ArticleCard';

export function Home() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [recentExperiments, setRecentExperiments] = useState([]);

  useEffect(() => {
    postsApi.getAll().then(posts => setLatestPosts(posts.slice(0, 4)));
    experimentsApi.getAll().then(exps => setRecentExperiments(exps.slice(0, 2)));
  }, []);

  return (
    <div className="space-y-24">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-radial-gradient pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-8">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#11141A] border border-[#1D222B] text-xs font-mono text-[#9CA3AF]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Currently building AI systems & developer tools</span>
          </motion.div>

          {/* Large Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.08] font-sans">
              BUILDING SYSTEMS. <br />
              <span className="text-[#6C8CFF]">EXPLORING INTELLIGENCE.</span> <br />
              WRITING WHAT I LEARN.
            </h1>
          </motion.div>

          {/* Short Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#9CA3AF] max-w-2xl leading-relaxed font-sans"
          >
            A personal engineering journal by <strong className="text-[#F5F7FA]">Shlok Bam</strong> covering multi-agent AI pipelines, data engineering, software architecture, and practical experiments.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              to="/journal"
              className="px-6 py-3 rounded-lg bg-[#6C8CFF] hover:bg-[#8BA5FF] text-[#08090B] font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#6C8CFF]/20 flex items-center gap-2"
            >
              <span>Explore Journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/experiments"
              className="px-6 py-3 rounded-lg bg-[#11141A] hover:bg-[#161B26] text-[#F5F7FA] border border-[#1D222B] hover:border-[#2E3646] font-medium text-sm transition-all duration-200 flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4 text-[#6C8CFF]" />
              <span>Lab Experiments</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Latest Signals */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1D222B]">
          <div>
            <span className="text-xs font-mono text-[#6C8CFF] uppercase tracking-wider block mb-1">
              ENGINEERING LOGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              LATEST SIGNALS
            </h2>
          </div>

          <Link
            to="/journal"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-[#9CA3AF] hover:text-[#6C8CFF] transition-colors"
          >
            <span>View All Signals ({latestPosts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {latestPosts.map((post, idx) => (
            <ArticleCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      </section>

      {/* Section 3: Recent Experiments */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1D222B]">
          <div>
            <span className="text-xs font-mono text-[#6C8CFF] uppercase tracking-wider block mb-1">
              BENCHMARKS & INVESTIGATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              RECENT EXPERIMENTS
            </h2>
          </div>

          <Link
            to="/experiments"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-[#9CA3AF] hover:text-[#6C8CFF] transition-colors"
          >
            <span>Lab Notebook</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentExperiments.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-4 hover:border-[#2E3646] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" /> EXPERIMENT
                </span>
                <span className="text-xs font-mono text-[#6B7280]">{exp.date}</span>
              </div>

              <h3 className="text-xl font-bold text-[#F5F7FA]">
                {exp.title}
              </h3>

              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                {exp.summary}
              </p>

              {/* Metrics Pills */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1D222B]/60 font-mono text-xs">
                {Object.entries(exp.metrics).slice(0, 2).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-[#11141A] border border-[#1D222B]">
                    <div className="text-[10px] text-[#6B7280] uppercase">{key}</div>
                    <div className="text-[#F5F7FA] font-bold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Footer Tagline */}
      <section className="py-12 text-center space-y-3 border-t border-[#1D222B]">
        <div className="text-xs font-mono text-[#6B7280] uppercase tracking-widest">
          BUILD · THINK · EXPLORE
        </div>
        <div className="font-mono text-xl font-bold text-[#F5F7FA]">
          SHLOK.BAM
        </div>
      </section>
    </div>
  );
}
