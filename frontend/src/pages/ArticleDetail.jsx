import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark.css';

import { ArrowLeft, Calendar, Clock, Share2, Copy, Check } from 'lucide-react';
import { Github } from '../components/ui/Icons';
import { postsApi } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { TableOfContents } from '../components/articles/TableOfContents';
import { ArticleImageEmbed } from '../components/articles/ArticleVisualEmbeds';

export function ArticleDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    setLoading(true);
    postsApi.getBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);

      if (data?.content) {
        // Extract headings for Table of Contents
        const matches = [...data.content.matchAll(/^(#{1,3})\s+(.+)$/gm)];
        const parsedHeadings = matches.map((m) => {
          const level = m[1].length;
          const title = m[2].trim();
          const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          return { level, title, id };
        });
        setHeadings(parsedHeadings);
      }
    });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-sm text-[#6B7280]">
        Loading signal...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="font-mono text-xl text-[#F5F7FA]">SIGNAL NOT FOUND</h2>
        <p className="text-sm text-[#9CA3AF]">The article you are looking for does not exist.</p>
        <Link to="/journal" className="inline-flex items-center gap-2 text-xs font-mono text-[#6C8CFF] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-12 w-full">
      {/* Back Link */}
      <div>
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#9CA3AF] hover:text-[#6C8CFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO JOURNAL
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-6 pb-8 border-b border-[#1D222B]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge type={post.content_type}>{post.content_type}</Badge>
          {post.category && (
            <span className="text-xs font-mono text-[#6B7280]">
              // {post.category}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-3xl">
          {post.excerpt}
        </p>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono text-[#6B7280]">
          <div className="flex items-center gap-6">
            <span className="text-[#F5F7FA] font-semibold">{post.author || 'Shlok Bam'}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11141A] border border-[#1D222B] text-[#9CA3AF] hover:text-[#F5F7FA] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Content + TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Article Body */}
        <main className="lg:col-span-8 prose-journal max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h1: ({ children }) => {
                const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h1 id={id}>{children}</h1>;
              },
              h2: ({ children }) => {
                const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h2 id={id}>{children}</h2>;
              },
              h3: ({ children }) => {
                const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h3 id={id}>{children}</h3>;
              },
              img: ({ src, alt }) => <ArticleImageEmbed src={src} alt={alt} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </main>

        {/* Sticky Desktop TOC Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-8">
          <div className="sticky top-24 p-6 rounded-xl bg-[#0D1117] border border-[#1D222B]">
            <TableOfContents headings={headings} />

            {post.github_repo && (
              <div className="mt-8 pt-6 border-t border-[#1D222B]">
                <a
                  href={`https://github.com/${post.github_repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-[#11141A] border border-[#1D222B] text-xs font-mono text-[#9CA3AF] hover:text-[#F5F7FA] hover:border-[#6C8CFF]/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-[#6C8CFF]" /> View Source
                  </span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
