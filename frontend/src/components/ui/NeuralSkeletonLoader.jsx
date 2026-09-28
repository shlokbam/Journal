import React from 'react';
import { motion } from 'framer-motion';

export function NeuralSkeletonLoader({ count = 3, message = "DECODING NEURAL ARCHIVE..." }) {
  return (
    <div className="space-y-6 w-full py-4">
      {/* Loading Status Radar Banner */}
      <div className="p-4 rounded-xl bg-[#0D1117] border border-[#6C8CFF]/30 shadow-[0_0_20px_rgba(108,140,255,0.1)] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C8CFF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6C8CFF]"></span>
          </span>
          <span className="text-[#F5F7FA] font-bold tracking-wider">{message}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[#6B7280]">
          <span className="animate-pulse text-[#6C8CFF]">⚡ SYNCHRONIZING NODES</span>
        </div>
      </div>

      {/* Skeleton Cards Grid */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] space-y-4 relative overflow-hidden"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#6C8CFF]/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 rounded-md bg-[#161B26] animate-pulse" />
                <div className="h-4 w-16 rounded bg-[#11141A] animate-pulse" />
              </div>
              <div className="h-4 w-24 rounded bg-[#11141A] animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-7 w-3/4 rounded-lg bg-[#161B26] animate-pulse" />
              <div className="h-4 w-full rounded bg-[#11141A] animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-[#11141A] animate-pulse" />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="h-5 w-14 rounded bg-[#11141A] animate-pulse" />
              <div className="h-5 w-16 rounded bg-[#11141A] animate-pulse" />
              <div className="h-5 w-12 rounded bg-[#11141A] animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
