import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, CheckCircle2, Server, ShieldCheck } from 'lucide-react';
import { onColdStartChange } from '../../services/api';

export function ColdStartBanner() {
  const [isColdStarting, setIsColdStarting] = useState(false);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = onColdStartChange(({ isColdStarting, isReady }) => {
      setIsColdStarting(isColdStarting);
      if (isReady) {
        setIsBackendReady(true);
        setTimeout(() => setIsColdStarting(false), 4000);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isColdStarting || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#0D1117] via-[#111622] to-[#0D1117] border border-[#6C8CFF]/40 shadow-[0_0_30px_rgba(108,140,255,0.2)] font-mono text-xs relative overflow-hidden"
      >
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6C8CFF] to-transparent animate-pulse" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#6C8CFF]/10 border border-[#6C8CFF]/30 text-[#6C8CFF] mt-0.5 md:mt-0">
              {isBackendReady ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#F5F7FA] font-bold text-sm">
                  {isBackendReady ? '⚡ RENDER BACKEND ACTIVE & READY' : '⚡ RENDER FREE-TIER BACKEND WARMUP IN PROGRESS'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isBackendReady ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {isBackendReady ? 'ONLINE' : '~30s SPIN UP'}
                </span>
              </div>

              <p className="text-[#9CA3AF] text-xs font-sans leading-relaxed">
                {isBackendReady
                  ? 'Python FastAPI & Neon PostgreSQL connection is fully active!'
                  : 'Render free-tier instances sleep after inactivity. Serving instant static cache in real-time so your reading is 100% uninterrupted!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#1D222B] pt-3 md:pt-0">
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Static Cache Fallback Active
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg bg-[#11141A] border border-[#1D222B] text-[#9CA3AF] hover:text-[#F5F7FA] transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
