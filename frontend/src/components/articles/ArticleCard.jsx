import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ArticleCard({ post, index }) {
  const formattedNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Link
        to={`/journal/${post.slug}`}
        className="group relative block p-6 sm:p-7 rounded-xl bg-[#0D1117] border border-[#1D222B] hover:border-[#2E3646] hover:bg-[#11141A] transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-black/40 overflow-hidden"
      >
        {/* Subtle accent border on hover */}
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
