import React, { useState, useEffect } from 'react';
import { FlaskConical, CheckCircle2, Cpu, BarChart2 } from 'lucide-react';
import { experimentsApi } from '../services/api';
import { TechTag } from '../components/ui/TechTag';

export function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experimentsApi.getAll().then((data) => {
      setExperiments(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="space-y-4 max-w-5xl">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4" /> LAB NOTEBOOK & RESEARCH
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FA]">
          TECHNICAL EXPERIMENTS
        </h1>
        <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
          Empirical investigations, model benchmarking, vector retrieval stress-tests, and architectural experiments.
        </p>
      </div>

      {/* Experiments Listing */}
      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-[#6B7280]">
          Loading experiments...
        </div>
      ) : experiments.length > 0 ? (
        <div className="space-y-8">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              className="p-6 sm:p-8 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-6 hover:border-[#2E3646] transition-colors shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1D222B]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/50">
                      STATUS // {exp.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">
                      LOGGED: {exp.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#F5F7FA]">
                    {exp.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(exp.tags || []).map((tag) => (
                    <TechTag key={tag}>{tag}</TechTag>
                  ))}
                </div>
              </div>

              {/* Hypothesis / Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
                  HYPOTHESIS & SUMMARY
                </h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {exp.summary}
                </p>
              </div>

              {/* Key Findings List */}
              <div className="space-y-3 p-4 rounded-lg bg-[#11141A] border border-[#1D222B]">
                <h3 className="text-xs font-mono text-[#6C8CFF] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> KEY FINDINGS & OBSERVED BEHAVIOR
                </h3>
                <ul className="space-y-2 text-xs font-mono text-[#D1D5DB]">
                  {(exp.findings || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#6C8CFF] shrink-0">→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Empirical Metrics Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" /> BENCHMARK METRICS
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(exp.metrics || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 rounded-lg bg-[#08090B] border border-[#1D222B] text-center"
                    >
                      <div className="text-[10px] font-mono text-[#6B7280] uppercase truncate">
                        {key}
                      </div>
                      <div className="text-base font-mono font-bold text-[#F5F7FA] mt-1">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-xl bg-[#0D1117] border border-[#1D222B] text-center space-y-3">
          <FlaskConical className="w-8 h-8 text-[#6B7280] mx-auto" />
          <h2 className="text-lg font-mono font-bold text-[#F5F7FA]">NO EXPERIMENTS LOGGED</h2>
          <p className="text-sm text-[#9CA3AF] max-w-md mx-auto">
            Laboratory benchmarks, latency investigations, and empirical model tests will be published here as they are conducted.
          </p>
        </div>
      )}
    </div>
  );
}
