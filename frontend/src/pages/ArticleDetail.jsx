import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark.css';
import { motion, useScroll, useSpring } from 'framer-motion';

import { ArrowLeft, Calendar, Clock, Share2, Copy, Check, ArrowUp } from 'lucide-react';
import { Github } from '../components/ui/Icons';
import { postsApi } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { TableOfContents } from '../components/articles/TableOfContents';
import { ArticleImageEmbed } from '../components/articles/ArticleVisualEmbeds';

// Custom Code Block component with Copy-to-Clipboard functionality
function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1].toUpperCase() : 'TEXT';

  const handleCopy = () => {
    const textToCopy = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl border border-[#1D222B] bg-[#0A0D12] overflow-hidden shadow-xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#11141A] border-b border-[#1D222B] text-xs font-mono text-[#6B7280]">
        <span className="text-[#6C8CFF] font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6C8CFF]"></span>
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D1117] border border-[#1D222B] text-[#9CA3AF] hover:text-[#F5F7FA] hover:border-[#6C8CFF]/40 transition-all duration-150"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto font-mono text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </div>
    </div>
  );
}

export function ArticleDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState([]);

  // Top Reading Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setLoading(true);
    postsApi.getBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);

      if (data) {
        // Dynamic title and meta tags for social media previews (WhatsApp, Twitter, LinkedIn)
        document.title = `${data.title} | Shlok Bam Journal`;
        
        const updateMeta = (selector, attr, content) => {
          let el = document.querySelector(selector);
          if (el && content) {
            el.setAttribute(attr, content);
          }
        };
        
        updateMeta('meta[property="og:title"]', 'content', data.title);
        updateMeta('meta[property="og:description"]', 'content', data.excerpt);
        updateMeta('meta[property="og:url"]', 'content', window.location.href);
        updateMeta('meta[name="twitter:title"]', 'content', data.title);
        updateMeta('meta[name="twitter:description"]', 'content', data.excerpt);
      }

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
    <>
      {/* 1. Top Reading Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#6C8CFF] z-50 origin-left shadow-[0_0_8px_rgba(108,140,255,0.8)]"
        style={{ scaleX }}
      />

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
                code: ({ node, inline, className, children, ...props }) => {
                  const content = String(children);
                  const isInline = inline || (!className && !content.includes('\n'));

                  if (isInline) {
                    return (
                      <code className="font-mono text-[#6C8CFF] bg-[#11141A] px-1.5 py-0.5 rounded border border-[#1D222B] text-[0.875em]" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{children}</CodeBlock>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </main>

          {/* Freezed Desktop TOC Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 self-start">
            <div className="p-6 rounded-xl bg-[#0D1117] border border-[#1D222B] shadow-2xl space-y-6">
              <TableOfContents headings={headings} />

              {post.github_repo && (
                <div className="pt-4 border-t border-[#1D222B]">
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

        {/* Bottom Article Actions & Go To Top Button */}
        <div className="pt-12 mt-12 border-t border-[#1D222B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#11141A] border border-[#1D222B] text-xs font-mono text-[#9CA3AF] hover:text-[#F5F7FA] hover:border-[#6C8CFF]/40 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#6C8CFF]" /> BACK TO JOURNAL
            </Link>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#11141A] border border-[#1D222B] text-xs font-mono text-[#9CA3AF] hover:text-[#F5F7FA] hover:border-[#6C8CFF]/40 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#6C8CFF]" />}
              <span>{copied ? 'LINK COPIED' : 'SHARE ARTICLE'}</span>
            </button>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6C8CFF]/10 border border-[#6C8CFF]/40 text-xs font-mono font-bold text-[#6C8CFF] hover:bg-[#6C8CFF] hover:text-[#08090B] shadow-[0_0_20px_rgba(108,140,255,0.25)] transition-all duration-200 group"
          >
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
            <span>GO TO TOP</span>
          </button>
        </div>
      </article>
    </>
  );
}
