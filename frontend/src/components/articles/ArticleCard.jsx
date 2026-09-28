import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ArticleCard({ post, index, variant = 'grid' }) {
  const formattedNumber = String(index + 1).padStart(2, '0');
  const [imgFailed, setImgFailed] = useState(false);

  // ----------------------------------------------------
  // 1. GRID / BOX CARD VARIANT (Square / Box proportions)
  // ----------------------------------------------------
  if (variant === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
        className="h-full"
      >
        <Link
          to={`/journal/${post.slug}`}
          className="group relative flex flex-col justify-between h-full rounded-2xl bg-[#0D1117] border border-[#1D222B] hover:border-[#6C8CFF]/40 hover:bg-[#11141A] transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-[#6C8CFF]/10 overflow-hidden"
        >
          {/* Top Banner Image / Graphic */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#08090B] border-b border-[#1D222B]">
            {post.cover_image && !imgFailed ? (
              <img
                src={post.cover_image}
                alt=""
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-85 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#161B26] via-[#11141A] to-[#08090B] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(#6C8CFF_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <span className="font-mono text-4xl font-extrabold text-[#6C8CFF]/30 group-hover:text-[#6C8CFF]/60 transition-colors z-10">
                  #{formattedNumber}
                </span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-black/30 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <Badge type={post.content_type}>{post.content_type}</Badge>

              <span className="px-2.5 py-1 rounded-md bg-[#0D1117]/80 backdrop-blur-md text-xs font-mono font-bold text-[#6C8CFF] border border-[#1D222B] shadow-sm">
                #{formattedNumber}
              </span>
            </div>
          </div>

          {/* Card Body Content */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              {post.category && (
                <div className="text-xs font-mono text-[#6B7280]">
                  // {post.category}
                </div>
              )}

              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#F5F7FA] group-hover:text-[#6C8CFF] transition-colors duration-200 line-clamp-2 leading-snug">
                {post.title}
              </h3>

              <p className="text-sm text-[#9CA3AF] line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Tags & Metadata Footer */}
            <div className="space-y-3 pt-4 border-t border-[#1D222B]/60">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 4 && (
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    +{post.tags.length - 4}
                  </span>
                )}
              </div>

              {/* Bottom Date & Reading Time */}
              <div className="flex items-center justify-between text-xs font-mono text-[#6B7280] pt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.published_at}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.reading_time}
                  </span>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#11141A] border border-[#1D222B] text-[#6B7280] flex items-center justify-center group-hover:text-[#F5F7FA] group-hover:border-[#6C8CFF]/50 group-hover:bg-[#6C8CFF]/10 transition-all duration-200">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ----------------------------------------------------
  // 2. LIST / RECTANGLE CARD VARIANT (Wide horizontal list)
  // ----------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: (index % 5) * 0.05 }}
    >
      <Link
        to={`/journal/${post.slug}`}
        className="group relative block p-6 sm:p-7 rounded-xl bg-[#0D1117] border border-[#1D222B] hover:border-[#2E3646] hover:bg-[#11141A] transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-black/40 overflow-hidden"
      >
        {/* Accent indicator line */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-transparent group-hover:bg-[#6C8CFF] transition-colors duration-200" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Index Number */}
          <div className="flex items-center gap-4 md:w-16 shrink-0">
            <span className="font-mono text-xl font-bold text-[#6B7280] group-hover:text-[#6C8CFF] transition-colors group-hover:translate-x-1 duration-200">
              {formattedNumber}
            </span>
          </div>

          {/* Core Post Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge type={post.content_type}>{post.content_type}</Badge>
              {post.category && (
                <span className="text-xs font-mono text-[#6B7280]">
                  // {post.category}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FA] group-hover:text-[#6C8CFF] transition-colors duration-200">
              {post.title}
            </h3>

            <p className="text-sm text-[#9CA3AF] line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Tags & Metadata */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#1D222B]/50">
              <div className="flex items-center gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.published_at}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.reading_time}
                </span>
              </div>
            </div>
          </div>

          {/* Hover Arrow Icon */}
          <div className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg bg-[#11141A] border border-[#1D222B] text-[#6B7280] group-hover:text-[#F5F7FA] group-hover:border-[#6C8CFF]/50 group-hover:bg-[#6C8CFF]/10 transition-all duration-200 shrink-0">
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
