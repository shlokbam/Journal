import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, ChevronRight, Terminal, RefreshCw, CheckCircle2 } from 'lucide-react';
import { postsApi, experimentsApi } from '../services/api';
import { ArticleCard } from '../components/articles/ArticleCard';

function HeroTerminalTicker() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      cmd: 'agy deploy --target=aws-ec2 --pipeline=jenkins',
      output: '✅ DevOps CI/CD Pipeline active on EC2 (Mumbai)',
      slug: 'i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong',
    },
    {
      cmd: 'datalens analyze --model=llama-3.3-70b --format=pdf',
      output: '✅ DataLens AI Copilot running CSV insights',
      slug: 'i-built-an-ai-data-analyst-app-from-scratch-here-s-how-i-taught-a-flask-app-to-think',
    },
    {
      cmd: 'mockvue evaluate --audio=whisper --eye=face-api',
      output: '✅ MockVue scoring multi-modal assessment',
      slug: 'i-built-an-ai-powered-mock-interview-platform-from-scratch-here-s-everything-that-went-wrong',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="rounded-xl bg-[#0D1117]/90 border border-[#1D222B] shadow-2xl p-4 font-mono text-xs space-y-3 relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between pb-2 border-b border-[#1D222B] text-[#6B7280]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="ml-2 text-[11px] text-[#9CA3AF] font-bold">shlokbam@journal-cli ~</span>
        </div>
        <button
          onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
          className="hover:text-[#F5F7FA] transition-colors p-1"
          title="Cycle telemetry step"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2 text-[#6C8CFF]">
          <span className="text-[#9CA3AF]">$</span>
          <span className="text-[#F5F7FA] font-medium">{steps[activeStep].cmd}</span>
          <span className="w-1.5 h-4 bg-[#6C8CFF] animate-pulse inline-block"></span>
        </div>

        <div className="text-emerald-400 font-medium flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {steps[activeStep].output}
          </span>
          <Link
            to={`/journal/${steps[activeStep].slug}`}
            className="text-[11px] text-[#9CA3AF] hover:text-[#6C8CFF] transition-colors flex items-center gap-1 underline"
          >
            <span>Read Postmortem</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [recentExperiments, setRecentExperiments] = useState([]);

  useEffect(() => {
    postsApi.getAll().then((posts) => setLatestPosts(posts.slice(0, 4)));
    experimentsApi.getAll().then((exps) => setRecentExperiments(exps.slice(0, 2)));
  }, []);

  return (
    <div className="space-y-24">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="relative max-w-5xl mx-auto space-y-8">
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

          {/* Interactive Hero Terminal Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="pt-2 max-w-3xl"
          >
            <HeroTerminalTicker />
          </motion.div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post, idx) => (
            <ArticleCard key={post.id} post={post} index={idx} variant="grid" />
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
          {recentExperiments.length > 0 ? (
            recentExperiments.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-4 hover:border-[#2E3646] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50 flex items-center gap-1">
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
                  {Object.entries(exp.metrics || {}).slice(0, 2).map(([key, val]) => (
                    <div key={key} className="p-2 rounded bg-[#11141A] border border-[#1D222B]">
                      <div className="text-[10px] text-[#6B7280] uppercase">{key}</div>
                      <div className="text-[#F5F7FA] font-bold mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 p-8 rounded-xl bg-[#0D1117] border border-[#1D222B] text-center space-y-2">
              <FlaskConical className="w-6 h-6 text-[#6B7280] mx-auto" />
              <p className="text-sm font-mono text-[#9CA3AF]">No active experiments published yet.</p>
              <p className="text-xs text-[#6B7280]">New empirical benchmarks and model investigations will be published here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
