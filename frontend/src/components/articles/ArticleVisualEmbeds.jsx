import React from 'react';
import { Terminal, CheckCircle2, AlertCircle, ExternalLink, Server, Cpu, Database, GitBranch, Layers, Activity, Brain, Mic, Eye, Play, Sparkles } from 'lucide-react';
import { Github } from '../ui/Icons';

export function ArticleImageEmbed({ src, alt }) {
  // Render custom screenshot / diagram cards based on image src identifier
  switch (src) {
    // ----------------------------------------------------
    // PROJECT-SPECIFIC HERO BANNERS
    // ----------------------------------------------------
    case 'devops-hero':
    case 'hero-banner':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 p-5 bg-[#08090B] border-r border-[#1D222B] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D222B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-[#6B7280]">Jenkinsfile</span>
              </div>
              <div className="text-[#9CA3AF] space-y-1">
                <p className="text-[#6C8CFF]">pipeline &#123;</p>
                <p className="pl-3 text-[#9CA3AF]">agent <span className="text-amber-400">any</span></p>
                <p className="pl-3 text-[#9CA3AF]">stages &#123;</p>
                <p className="pl-6 text-emerald-400">✓ Clone Code <span className="text-[#6B7280]">0.91s</span></p>
                <p className="pl-6 text-emerald-400">✓ Build Docker Image <span className="text-[#6B7280]">45s</span></p>
                <p className="pl-6 text-emerald-400">✓ Deploy with Docker Compose <span className="text-[#6B7280]">5m 48s</span></p>
                <p className="pl-6 text-emerald-400">✓ Deployment Status <span className="text-[#6B7280]">26s</span></p>
                <p className="pl-3 text-[#9CA3AF]">&#125;</p>
                <p className="text-[#6C8CFF]">&#125;</p>
              </div>

              <div className="pt-3 border-t border-[#1D222B] space-y-2">
                <p className="text-[#6C8CFF]">$ docker ps</p>
                <p className="text-[#9CA3AF]">flask-app Up 2 minutes <span className="text-emerald-400">0.0.0.0:5000-&gt;5000/tcp</span></p>
                <p className="text-[#9CA3AF]">mysql Up 3 minutes (healthy) <span className="text-emerald-400">3306/tcp</span></p>
              </div>

              <div className="pt-3 border-t border-[#1D222B] space-y-2">
                <p className="text-[#6C8CFF]">$ terraform apply</p>
                <p className="text-emerald-400">aws_instance.flask_server: Creating...</p>
                <p className="text-emerald-400">Apply complete! Resources: 2 added.</p>
                <p className="text-[#9CA3AF]">ec2_public_ip = <span className="text-amber-300">"3.110.85.1"</span></p>
              </div>

              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Error: disk full – 99.8% of 6.71GB used
                </p>
                <p className="text-[#9CA3AF]">Fixed: upgraded volume 8GB -&gt; 20GB via Terraform + growpart + resize2fs</p>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0D1117] to-[#11141A]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#6C8CFF]/10 text-[#6C8CFF] font-mono text-xs border border-[#6C8CFF]/20">
                  <Activity className="w-3.5 h-3.5" /> #DevOps Postmortem
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight">
                  I Built a <span className="text-[#6C8CFF]">Full DevOps CI/CD</span> Pipeline from Scratch
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  Here's Everything That Went Wrong
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['Docker', 'Jenkins', 'Terraform', 'AWS EC2', 'Flask', 'MySQL', 'GitHub', 'Webhook'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-[#9CA3AF]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-[#1D222B] text-xs font-mono text-[#6B7280]">
                <div>
                  <span className="text-[#F5F7FA] font-semibold">8 real errors.</span><br />
                  <span className="text-emerald-400 font-semibold">8 real fixes.</span><br />
                  <span className="text-[#6C8CFF] font-semibold">1 working pipeline.</span>
                </div>
                <div className="text-right">
                  <span className="text-[#F5F7FA] font-bold">Shlok Bam</span><br />
                  <span>shlokbam.dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'dailydiff-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 p-5 bg-[#08090B] border-r border-[#1D222B] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D222B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-[#6B7280]">run_agent.py — LangGraph 7-Agent DAG</span>
              </div>

              <div className="text-[#9CA3AF] space-y-1 text-[11px]">
                <p className="text-[#6C8CFF]">$ python backend/run_agent.py</p>
                <p className="text-[#6B7280]">[Scout] Ingested 30 HN topstories + GitHub Releases</p>
                <p className="text-[#6B7280]">[Skeptic] Deduplicated 22 links, 8 passed hype filter</p>
                <p className="text-emerald-400">✓ [Research] Cleaned target READMEs & release notes</p>
                <p className="text-emerald-400">✓ [Verifier] Technical assertions verified against docs</p>
                <p className="text-amber-300">★ [Analyst] Rated: 2 INTEGRATE, 2 WATCH, 1 READ</p>
                <p className="text-indigo-400">⚡ [Editor] Applied ELI5 rules & compiled 5-point TL;DR</p>
              </div>

              <div className="pt-3 border-t border-[#1D222B] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Primary Engine: <strong className="text-[#F5F7FA]">Mistral 8x22b</strong></span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Failover Backup: <strong className="text-[#F5F7FA]">Gemini Flash 3.5</strong></span>
                  <span className="text-amber-400">READY</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-between font-mono">
                <span>[Publisher] Email Brief Dispatched</span>
                <span className="font-bold">Brevo API 200 OK</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0D1117] via-[#0F141F] to-[#121929]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#6C8CFF]/10 text-[#6C8CFF] font-mono text-xs border border-[#6C8CFF]/20">
                  <Sparkles className="w-3.5 h-3.5" /> Autonomous Editorial Engine
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight">
                  DailyDiff — <span className="text-[#6C8CFF]">7-Agent LangGraph</span> Editorial Team
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  "We scan the noise, five things survive." Automated multi-agent intelligence filtering tech noise into sharp developer briefings.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['LangGraph', 'Python 3.12', 'FastAPI', 'Mistral AI', 'Gemini Flash', 'Brevo API', 'Vite + React', 'dailydiff.in'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-[#6C8CFF]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-[#1D222B] text-xs font-mono text-[#6B7280]">
                <div>
                  <span className="text-[#F5F7FA] font-semibold">0% Marketing Hype.</span><br />
                  <span className="text-emerald-400 font-semibold">100% Verified Code.</span>
                </div>
                <div className="text-right">
                  <span className="text-[#F5F7FA] font-bold">Shlok Bam</span><br />
                  <span>dailydiff.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'multiagent-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 p-5 bg-[#08090B] border-r border-[#1D222B] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D222B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-[#6B7280]">pipeline.py — Asynchronous Telemetry</span>
              </div>

              <div className="text-[#9CA3AF] space-y-1 text-[11px]">
                <p className="text-purple-400">$ GET /api/research?topic=Fusion+Reactor</p>
                <p className="text-[#6B7280]">[Search Agent] Tavily Parallel Indexer query 200 OK</p>
                <p className="text-emerald-400">✓ [Reader Agent] Sanitized DOM: stripped &lt;script&gt;/&lt;nav&gt;</p>
                <p className="text-[#6B7280]">[Reader Agent] Text length capped at 3,000 clean chars</p>
                <p className="text-[#F5F7FA]">✓ [Writer Specialist] Drafted multi-section markdown report</p>
                <p className="text-amber-300">★ [Review Critic] Score: 9.2/10 — Passed Fact Audit</p>
              </div>

              <div className="pt-3 border-t border-[#1D222B] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>RAG Chunking: <strong className="text-[#F5F7FA]">1000 chars / 200 overlap</strong></span>
                  <span className="text-purple-400">Mistral Embed</span>
                </div>
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Vector Store: <strong className="text-[#F5F7FA]">Pinecone Cloud</strong></span>
                  <span className="text-emerald-400 font-bold">SYNCED</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] flex items-center justify-between font-mono">
                <span>[FastAPI Server] SSE Event Stream</span>
                <span className="font-bold">Streaming Active</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0D1117] via-[#150E24] to-[#201336]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 font-mono text-xs border border-purple-500/20">
                  <Brain className="w-3.5 h-3.5" /> Multi-Agent AI System
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight">
                  Autonomous AI <span className="text-purple-400">Research & Fact Audit</span> System
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  Asynchronous multi-agent pipeline with DOM sanitization, peer-auditing, vector RAG indexing, and SSE telemetry streaming.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['LangChain', 'Python 3.13', 'Mistral AI', 'Tavily Search', 'Pinecone', 'ChromaDB', 'FastAPI SSE'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-purple-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-[#1D222B] text-xs font-mono text-[#6B7280]">
                <div>
                  <span className="text-[#F5F7FA] font-semibold">0% Hallucinations.</span><br />
                  <span className="text-purple-400 font-semibold">100% Peer Audited.</span>
                </div>
                <div className="text-right">
                  <span className="text-[#F5F7FA] font-bold">Shlok Bam</span><br />
                  <span>github.com/shlokbam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'inventory-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 p-5 bg-[#08090B] border-r border-[#1D222B] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D222B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-[#6B7280]">stock_service.py — FIFO & Locking</span>
              </div>

              <div className="text-[#9CA3AF] space-y-1 text-[11px]">
                <p className="text-emerald-400">$ POST /api/transactions (Qty: 50 units)</p>
                <p className="text-amber-300">🔒 SQL: SELECT * FROM batches WITH FOR UPDATE</p>
                <p className="text-emerald-400">✓ Deducted 20 units from Batch #101 (Oldest)</p>
                <p className="text-emerald-400">✓ Deducted 30 units from Batch #104 (Next Oldest)</p>
                <p className="text-[#6B7280]">✓ Customer Ledger Updated: Balance $145.00</p>
                <p className="text-[#F5F7FA]">✓ ReportLab PDF Invoice Generated (In-Memory)</p>
              </div>

              <div className="pt-3 border-t border-[#1D222B] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>DB Concurrency: <strong className="text-[#F5F7FA]">Pessimistic Locking</strong></span>
                  <span className="text-emerald-400 font-bold">SAFE</span>
                </div>
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Precision Engine: <strong className="text-[#F5F7FA]">Decimal NUMERIC(10,2)</strong></span>
                  <span className="text-emerald-400">EXACT</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-between font-mono">
                <span>[Telegram Bot] Webhook Dispatched</span>
                <span className="font-bold">PDF Invoice Sent</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0D1117] via-[#0E1F1A] to-[#122E26]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/20">
                  <Database className="w-3.5 h-3.5" /> Enterprise Systems
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight">
                  Enterprise <span className="text-emerald-400">Inventory & FIFO</span> System
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  Real-time inventory management with FIFO stock reduction, transaction concurrency locks, ReportLab PDF billing, and Telegram alerts.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'FIFO Engine', 'ReportLab PDF', 'Telegram API', 'React', 'TailwindCSS'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-emerald-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-[#1D222B] text-xs font-mono text-[#6B7280]">
                <div>
                  <span className="text-[#F5F7FA] font-semibold">0 Race Conditions.</span><br />
                  <span className="text-emerald-400 font-semibold">Instant Telegram Billing.</span>
                </div>
                <div className="text-right">
                  <span className="text-[#F5F7FA] font-bold">Shlok Bam</span><br />
                  <span>github.com/shlokbam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'eagle-lms-hero':
    case 'lms-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-6 p-5 bg-[#08090B] border-r border-[#1D222B] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D222B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-[#6B7280]">eagle_lms — Industry Project</span>
              </div>

              <div className="text-[#9CA3AF] space-y-1 text-[11px]">
                <p className="text-[#6C8CFF]">$ Client: Eagle Industrial Services Pvt. Ltd.</p>
                <p className="text-[#6B7280]">Workforce Scale: 2,500+ Security Guards & Housekeeping</p>
                <p className="text-emerald-400">✓ 7 Industry Stakeholder Meetings Executed</p>
                <p className="text-emerald-400">✓ Phased Module Delivery & Timed MCQ Assessments</p>
                <p className="text-amber-300">★ ReportLab + Pillow PDF Watermark Engine</p>
                <p className="text-indigo-400">⚡ Web Portal (React+Vite) + Mobile App (Expo React Native)</p>
              </div>

              <div className="pt-3 border-t border-[#1D222B] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Team Size: <strong className="text-[#F5F7FA]">5 Students (VIT Pune)</strong></span>
                  <span className="text-emerald-400 font-bold">COMPLETED</span>
                </div>
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Industry Sponsor: <strong className="text-[#F5F7FA]">Mr. Manish Godse</strong></span>
                  <span className="text-emerald-400">Eagle Securities</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center justify-between font-mono">
                <span>[Status] Code Review & QA Testing</span>
                <span className="font-bold">Production Ready</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0D1117] via-[#101424] to-[#161C33]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-xs border border-indigo-500/20">
                  <Layers className="w-3.5 h-3.5" /> Industry Sponsored LMS
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight">
                  Building <span className="text-indigo-400">Eagle LMS</span>: From Napkin to Production
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  An enterprise Learning Management System for 2,500+ workforce. 7 meetings, real production bugs, watermark engine, and cross-platform deployment.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['React + Vite', 'Expo React Native', 'FastAPI', 'PostgreSQL', 'ReportLab', 'Pillow', 'JWT Auth'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-indigo-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between border-t border-[#1D222B] text-xs font-mono text-[#6B7280]">
                <div>
                  <span className="text-[#F5F7FA] font-semibold">2,500+ Active Users.</span><br />
                  <span className="text-indigo-400 font-semibold">Web + Mobile Apps.</span>
                </div>
                <div className="text-right">
                  <span className="text-[#F5F7FA] font-bold">Shlok Bam</span><br />
                  <span>VIT Pune</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'architecture-diagram':
      return (
        <div className="my-8 p-6 rounded-2xl bg-[#0D1117] border border-[#1D222B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1D222B] pb-3 text-xs font-mono">
            <span className="text-[#F5F7FA] font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6C8CFF]" /> Full CI/CD Pipeline Architecture Topology
            </span>
            <span className="text-[#6B7280]">Interactive Schema</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-2 relative group hover:border-[#6C8CFF]/50 transition-colors">
              <div className="text-[10px] text-[#6C8CFF] font-semibold">STEP 01</div>
              <div className="text-[#F5F7FA] font-bold flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-[#6C8CFF]" /> Local Workstation
              </div>
              <p className="text-[11px] text-[#6B7280]">Developer pushes code to remote repo</p>
              <div className="pt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                git push main ➔
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-2 relative group hover:border-[#6C8CFF]/50 transition-colors">
              <div className="text-[10px] text-[#6C8CFF] font-semibold">STEP 02</div>
              <div className="text-[#F5F7FA] font-bold flex items-center gap-1.5">
                <Github className="w-4 h-4 text-[#F5F7FA]" /> GitHub Repository
              </div>
              <p className="text-[11px] text-[#6B7280]">Receives payload & fires HTTP POST event</p>
              <div className="pt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                Webhook Trigger ➔
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-2 relative group hover:border-[#6C8CFF]/50 transition-colors">
              <div className="text-[10px] text-[#6C8CFF] font-semibold">STEP 03</div>
              <div className="text-[#F5F7FA] font-bold flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-400" /> Jenkins (AWS EC2)
              </div>
              <p className="text-[11px] text-[#6B7280]">Orchestrates 4-stage build pipeline automatically</p>
              <div className="pt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                Build & Deploy ➔
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-2 relative group hover:border-[#6C8CFF]/50 transition-colors">
              <div className="text-[10px] text-[#6C8CFF] font-semibold">STEP 04</div>
              <div className="text-[#F5F7FA] font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" /> Docker Compose
              </div>
              <p className="text-[11px] text-[#6B7280]">Flask App (:5000) + MySQL (:3306) containers</p>
              <div className="pt-2 text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                Networking ➔
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2 relative group hover:border-emerald-500/60 transition-colors">
              <div className="text-[10px] text-emerald-400 font-semibold">STEP 05</div>
              <div className="text-[#F5F7FA] font-bold flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-emerald-400" /> Live Endpoint
              </div>
              <p className="text-[11px] text-emerald-300/80">http://3.110.85.1:5000 live and responding</p>
              <div className="pt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                STATUS: 200 OK
              </div>
            </div>
          </div>
        </div>
      );

    case 'docker-ps':
      return (
        <div className="my-8 rounded-xl bg-[#0D1117] border border-[#1D222B] overflow-hidden font-mono text-xs shadow-xl">
          <div className="px-4 py-3 bg-[#11141A] border-b border-[#1D222B] flex items-center justify-between text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="ml-2 text-xs font-semibold text-[#F5F7FA]">Terminal — docker ps verification</span>
            </div>
            <span className="text-[11px] text-[#6B7280]">shlokbam@Shloks-MacBook-Air</span>
          </div>

          <div className="p-4 bg-[#08090B] text-[#9CA3AF] space-y-3 overflow-x-auto">
            <p className="text-[#6C8CFF]">$ docker ps</p>
            <div className="text-[11px] text-[#6B7280] border-b border-[#1D222B] pb-2 grid grid-cols-12 gap-2">
              <span className="col-span-2 font-bold text-[#9CA3AF]">CONTAINER ID</span>
              <span className="col-span-3 font-bold text-[#9CA3AF]">IMAGE</span>
              <span className="col-span-2 font-bold text-[#9CA3AF]">COMMAND</span>
              <span className="col-span-2 font-bold text-[#9CA3AF]">STATUS</span>
              <span className="col-span-3 font-bold text-[#9CA3AF]">PORTS & NAMES</span>
            </div>

            <div className="grid grid-cols-12 gap-2 text-[11px] py-1 border-b border-[#1D222B]/40 items-center">
              <span className="col-span-2 text-amber-300">0b3f03244c40</span>
              <span className="col-span-3 text-[#F5F7FA]">flask-todo-app-flask</span>
              <span className="col-span-2 text-[#6B7280]">"python app.py"</span>
              <span className="col-span-2 text-emerald-400 font-semibold">Up 17 hours</span>
              <span className="col-span-3 text-[#6C8CFF]">0.0.0.0:5000-&gt;5000/tcp (flask-app)</span>
            </div>

            <div className="grid grid-cols-12 gap-2 text-[11px] py-1 items-center">
              <span className="col-span-2 text-amber-300">8d72a49c1ce7</span>
              <span className="col-span-3 text-[#F5F7FA]">mysql:8.0</span>
              <span className="col-span-2 text-[#6B7280]">"docker-entrypoint..."</span>
              <span className="col-span-2 text-emerald-400 font-semibold">Up 17 hours (healthy)</span>
              <span className="col-span-3 text-[#6C8CFF]">0.0.0.0:3307-&gt;3306/tcp (mysql)</span>
            </div>
          </div>
        </div>
      );

    case 'jenkins-dashboard':
      return (
        <div className="my-8 rounded-xl bg-[#0D1117] border border-[#1D222B] overflow-hidden text-xs shadow-xl font-sans">
          <div className="px-4 py-3 bg-[#161B26] border-b border-[#1D222B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-[#6C8CFF] text-[#08090B] font-bold flex items-center justify-center font-mono text-xs">
                J
              </div>
              <span className="font-semibold text-[#F5F7FA]">Jenkins 2.541.2 Dashboard</span>
              <span className="text-[#6B7280]">/ Shlok Bam</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Service Healthy
            </div>
          </div>

          <div className="p-5 bg-[#0D1117] grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[#11141A] border border-[#1D222B] space-y-1">
              <div className="text-[#6B7280] text-[11px]">ACTIVE JOBS</div>
              <div className="text-lg font-bold text-[#F5F7FA]">flask-todo-pipeline</div>
              <div className="text-xs text-emerald-400 font-mono">Last build: #9 SUCCESS</div>
            </div>
            <div className="p-3 rounded-lg bg-[#11141A] border border-[#1D222B] space-y-1">
              <div className="text-[#6B7280] text-[11px]">EXECUTOR AGENT</div>
              <div className="text-lg font-bold text-[#F5F7FA]">Built-In Node</div>
              <div className="text-xs text-[#9CA3AF] font-mono">Status: Idle</div>
            </div>
            <div className="p-3 rounded-lg bg-[#11141A] border border-[#1D222B] space-y-1">
              <div className="text-[#6B7280] text-[11px]">SCM POLLING</div>
              <div className="text-lg font-bold text-[#F5F7FA]">GitHub Hook</div>
              <div className="text-xs text-indigo-400 font-mono">GITScm Polling Active</div>
            </div>
            <div className="p-3 rounded-lg bg-[#11141A] border border-[#1D222B] space-y-1">
              <div className="text-[#6B7280] text-[11px]">CREDENTIALS</div>
              <div className="text-lg font-bold text-[#F5F7FA]">SSH + Docker</div>
              <div className="text-xs text-amber-400 font-mono">Root Privileges Granted</div>
            </div>
          </div>
        </div>
      );

    case 'disk-space':
      return (
        <div className="my-8 rounded-xl bg-[#0D1117] border border-[#1D222B] overflow-hidden font-mono text-xs shadow-xl">
          <div className="px-4 py-2.5 bg-[#11141A] border-b border-[#1D222B] text-[#9CA3AF] flex items-center justify-between">
            <span className="text-[#F5F7FA] font-semibold">EC2 Filesystem Resize — df -h Verification</span>
            <span className="text-[#6B7280]">ubuntu@ip-172-31-0-224</span>
          </div>
          <div className="p-4 bg-[#08090B] space-y-2 text-[#9CA3AF]">
            <p className="text-[#6C8CFF]">$ sudo growpart /dev/xvda 1 && sudo resize2fs /dev/root</p>
            <p className="text-emerald-400">CHANGED: partition 1 resized from 8GB to 20GB on /dev/xvda</p>
            <p className="text-[#6C8CFF]">$ df -h</p>
            <div className="pt-2 text-[11px] text-[#F5F7FA] space-y-1">
              <p className="text-[#6B7280]">Filesystem      Size  Used Avail Use% Mounted on</p>
              <p className="text-emerald-300 font-bold">/dev/root        19G  6.2G   13G  34% /</p>
              <p className="text-[#6B7280]">tmpfs           478M   36K  478M   1% /dev/shm</p>
              <p className="text-[#6B7280]">tmpfs           191M  1.1M  190M   1% /run</p>
              <p className="text-[#6B7280]">/dev/xvda16     881M  162M  657M  20% /boot</p>
            </div>
          </div>
        </div>
      );

    case 'jenkins-pipeline-graph':
      return (
        <div className="my-8 p-6 rounded-2xl bg-[#0D1117] border border-[#1D222B] space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between border-b border-[#1D222B] pb-4 gap-2">
            <div>
              <div className="text-xs font-mono text-[#6C8CFF]">JENKINS BUILD #9 STAGE VIEW</div>
              <h4 className="text-lg font-bold text-[#F5F7FA]">flask-todo-pipeline — Pipeline Execution Graph</h4>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESSFUL (Took 11m 45s)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">1. Clone Code</span>
                <span className="text-emerald-400 font-bold">0.87s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">git branch: 'main'</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">2. Build Image</span>
                <span className="text-emerald-400 font-bold">5m 12s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">docker build -t flask-todo-app</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">3. Deploy Compose</span>
                <span className="text-emerald-400 font-bold">5m 48s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">docker compose up -d</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">4. Status Check</span>
                <span className="text-emerald-400 font-bold">25s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">docker ps verification</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#08090B] border border-[#1D222B] font-mono text-xs text-emerald-400">
            [Jenkins Console Output] Deployment successful! App running on port 5000.
          </div>
        </div>
      );

    case 'live-app':
      return (
        <div className="my-8 rounded-2xl bg-[#0D1117] border border-[#1D222B] overflow-hidden shadow-2xl font-sans">
          <div className="px-4 py-3 bg-[#161B26] border-b border-[#1D222B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <div className="ml-4 px-3 py-1 rounded-md bg-[#0D1117] border border-[#1D222B] text-xs font-mono text-[#9CA3AF] flex items-center gap-2">
                <span className="text-emerald-400 font-bold">http://</span>3.110.85.1:5000
              </div>
            </div>
            <span className="text-xs font-mono text-[#6B7280]">Live Application</span>
          </div>

          <div className="p-8 bg-[#F8FAFC] text-slate-900 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Task Manager</h2>
              <p className="text-xs text-slate-500">
                A simple DevOps demo app — Website (Flask + MySQL) + Containerized (Docker) + Automated CI/CD (Jenkins) + AWS Setup (Terraform)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center font-mono">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-indigo-600">3</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOTAL</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-emerald-600">1</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DONE</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-amber-600">2</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PENDING</div>
              </div>
            </div>

            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                readOnly
              />
              <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700">
                + Add
              </button>
            </div>

            <div className="space-y-2 max-w-md mx-auto font-mono text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                  <span className="text-slate-800 font-medium">demo4</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100">Done</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-semibold border border-rose-100">Delete</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  <span className="text-slate-800 font-medium">demo2</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">Undo</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-semibold border border-rose-100">Delete</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                  <span className="text-slate-800 font-medium">demo1</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100">Done</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-semibold border border-rose-100">Delete</span>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center text-[11px] font-mono text-slate-400 border-t border-slate-200">
              Deployed via Jenkins CI/CD Pipeline on AWS EC2
            </div>
          </div>
        </div>
      );

    case 'github-webhook':
      return (
        <div className="my-8 p-6 rounded-2xl bg-[#0D1117] border border-[#1D222B] space-y-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#1D222B] pb-3">
            <span className="text-[#F5F7FA] font-semibold flex items-center gap-2">
              <Github className="w-4 h-4 text-[#6C8CFF]" /> GitHub Webhook Deliveries & Jenkins Polling Config
            </span>
            <span className="text-emerald-400 font-bold">Status 200 OK</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-3">
              <div className="text-[#6C8CFF] font-bold">GitHub Webhook Deliveries</div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-[#08090B] border border-[#1D222B] flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">✓ push</span>
                  <span className="text-[#6B7280]">2026-03-14 13:50:18</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#1D222B] flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">✓ push</span>
                  <span className="text-[#6B7280]">2026-03-14 13:48:45</span>
                </div>
                <div className="p-2 rounded bg-[#08090B] border border-[#1D222B] flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">✓ push</span>
                  <span className="text-[#6B7280]">2026-03-14 12:54:19</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-3">
              <div className="text-emerald-400 font-bold">Jenkins Build Triggers Config</div>
              <div className="p-3 rounded bg-[#08090B] border border-emerald-500/30 text-emerald-300 text-[11px] space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500 text-slate-900 flex items-center justify-center text-[10px]">✓</span>
                  GitHub hook trigger for GITScm polling
                </div>
                <p className="text-[#9CA3AF] text-[10px]">
                  Set up automated actions that start your build based on specific events, like code changes or scheduled times.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // ARTICLE 2: AI Data Analyst App (DataLens)
    // ----------------------------------------------------
    case 'datalens-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-8 bg-gradient-to-br from-[#0B1516] via-[#0D1117] to-[#102022]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 font-mono text-xs border border-teal-500/20">
                <Sparkles className="w-3.5 h-3.5" /> AI Data Science Project
              </div>
              <h3 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
                DataLens — <span className="text-teal-400">AI Data Analyst</span> Copilot
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                CSV uploads + Groq (Llama 3.3 70B) AI insights + auto-generated Matplotlib charts + persistent chat history + ReportLab PDF export.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Python', 'Flask', 'Groq Llama 3.3', 'Pandas', 'Matplotlib', 'ReportLab', 'SQLite'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-teal-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#08090B] border border-teal-500/30 text-teal-400 font-mono text-center space-y-2 w-full md:w-64 shadow-lg">
              <div className="text-3xl font-black">2,823</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">CSV Rows Analyzed</div>
              <div className="text-xs text-emerald-400 pt-2 border-t border-[#1D222B]">Groq 70B Token Optimization: ~800 tokens/query</div>
            </div>
          </div>
        </div>
      );

    case 'datalens-flow':
      return (
        <div className="my-8 p-6 rounded-2xl bg-[#0D1117] border border-[#1D222B] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#1D222B] pb-3">
            <span className="text-[#F5F7FA] font-bold flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-400" /> DataLens Analytical Pipeline Flow
            </span>
            <span className="text-teal-400">7-Step Execution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-1">
              <span className="text-[10px] text-teal-400 font-bold">1. CSV UPLOAD</span>
              <p className="text-[#F5F7FA] font-semibold">User Uploads CSV</p>
              <p className="text-[11px] text-[#6B7280]">Stored locally & validated</p>
            </div>
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-1">
              <span className="text-[10px] text-teal-400 font-bold">2. PANDAS SUMMARY</span>
              <p className="text-[#F5F7FA] font-semibold">Pre-process Compact Text</p>
              <p className="text-[11px] text-[#6B7280]">Extract stats, columns & samples</p>
            </div>
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-1">
              <span className="text-[10px] text-teal-400 font-bold">3. GROQ LLAMA 70B</span>
              <p className="text-[#F5F7FA] font-semibold">Generates Insight Answer</p>
              <p className="text-[11px] text-[#6B7280]">3 separate deterministic API calls</p>
            </div>
            <div className="p-4 rounded-xl bg-[#11141A] border border-teal-500/30 bg-teal-500/5 space-y-1">
              <span className="text-[10px] text-teal-300 font-bold">4. CHART & PDF</span>
              <p className="text-[#F5F7FA] font-semibold">Matplotlib + ReportLab</p>
              <p className="text-[11px] text-teal-400">Render charts & export PDF</p>
            </div>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // ARTICLE 3: MockVue AI Interview Platform
    // ----------------------------------------------------
    case 'mockvue-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-8 bg-gradient-to-br from-[#130E20] via-[#0D1117] to-[#1B132B]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 font-mono text-xs border border-purple-500/20">
                <Mic className="w-3.5 h-3.5" /> Full-Stack AI Assessment Platform
              </div>
              <h3 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
                MockVue — <span className="text-purple-400">AI Mock Interview</span> Platform
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                React 19 + FastAPI + TiDB Cloud + Groq Whisper & Llama 3.3 70B + face-api.js real-time gaze & eye contact tracking.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['React 19', 'FastAPI', 'TiDB Cloud', 'Whisper AI', 'Llama 3.3 70B', 'face-api.js', 'Vercel'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-purple-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#08090B] border border-purple-500/30 text-purple-400 font-mono text-center space-y-2 w-full md:w-64 shadow-lg">
              <div className="text-3xl font-black">270+</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Curated Interview Questions</div>
              <div className="text-xs text-purple-300 pt-2 border-t border-[#1D222B]">13 Top Companies & 5 Core Tech Roles</div>
            </div>
          </div>
        </div>
      );

    case 'mockvue-architecture':
      return (
        <div className="my-8 p-6 rounded-2xl bg-[#0D1117] border border-[#1D222B] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#1D222B] pb-3">
            <span className="text-[#F5F7FA] font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" /> MockVue End-to-End System Architecture
            </span>
            <span className="text-purple-400">Browser to Cloud</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-1">
              <span className="text-[10px] text-purple-400 font-bold">FRONTEND RECORDING</span>
              <p className="text-[#F5F7FA] font-semibold">Camera + Mic + face-api.js</p>
              <p className="text-[11px] text-[#6B7280]">Tracks gaze ratio & WPM live</p>
            </div>
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-1">
              <span className="text-[10px] text-purple-400 font-bold">WHISPER TRANSCRIPTION</span>
              <p className="text-[#F5F7FA] font-semibold">Groq Whisper API</p>
              <p className="text-[11px] text-[#6B7280]">Generates exact text & pauses</p>
            </div>
            <div className="p-4 rounded-xl bg-[#11141A] border border-[#1D222B] space-y-1">
              <span className="text-[10px] text-purple-400 font-bold">LLAMA 70B GRADING</span>
              <p className="text-[#F5F7FA] font-semibold">Rubric-Based Scorecard</p>
              <p className="text-[11px] text-[#6B7280]">Evaluates answer quality (40% max)</p>
            </div>
            <div className="p-4 rounded-xl bg-[#11141A] border border-purple-500/30 bg-purple-500/5 space-y-1">
              <span className="text-[10px] text-purple-300 font-bold">TIDB CLOUD DATABASE</span>
              <p className="text-[#F5F7FA] font-semibold">Serverless MySQL</p>
              <p className="text-[11px] text-purple-400">Stores session score (100 pts max)</p>
            </div>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // LEARN ARTICLES HERO CARDS
    // ----------------------------------------------------
    case 'agentic-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-8 bg-gradient-to-br from-[#0B1528] via-[#0D1117] to-[#131C31]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C8CFF]/10 text-[#6C8CFF] font-mono text-xs border border-[#6C8CFF]/20">
                <Brain className="w-3.5 h-3.5" /> LangGraph State Graph & Agentic AI
              </div>
              <h3 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
                LangGraph — <span className="text-[#6C8CFF]">Agentic State Machine</span> Lab
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Sequential execution, parallel fan-out/fan-in, conditional discriminant routing, TypedDict state reducers, and visual graph flowcharts.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['LangGraph', 'Python 3.12', 'State Graphs', 'TypedDict', 'Conditional Routing', 'Mistral AI'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-[#6C8CFF]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#08090B] border border-[#6C8CFF]/30 text-[#6C8CFF] font-mono text-center space-y-2 w-full md:w-64 shadow-lg">
              <div className="text-3xl font-black">3 WORKFLOWS</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Sequential • Parallel • Conditional</div>
              <div className="text-xs text-[#6C8CFF] pt-2 border-t border-[#1D222B]">LangChain & State Graph Patterns</div>
            </div>
          </div>
        </div>
      );

    case 'mcp-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-8 bg-gradient-to-br from-[#161224] via-[#0D1117] to-[#14122B]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 font-mono text-xs border border-purple-500/20">
                <Cpu className="w-3.5 h-3.5" /> Anthropic Model Context Protocol
              </div>
              <h3 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
                MCP — <span className="text-purple-400">Client, Server & FastMCP</span> Lab
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Streamlit MCP Client, Stdio & SSE Transports, FastMCP Python SDK, emailmd API connectivity, and dynamic tool discovery.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['MCP Standard', 'FastMCP', 'JSON-RPC 2.0', 'Streamlit', 'LangGraph', 'Stdio Transport'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-purple-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#08090B] border border-purple-500/30 text-purple-400 font-mono text-center space-y-2 w-full md:w-64 shadow-lg">
              <div className="text-3xl font-black">JSON-RPC 2.0</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Universal AI Tool Protocol</div>
              <div className="text-xs text-purple-300 pt-2 border-t border-[#1D222B]">Tools • Resources • Prompts</div>
            </div>
          </div>
        </div>
      );

    case 'langsmith-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-8 bg-gradient-to-br from-[#0F1E19] via-[#0D1117] to-[#12241E]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/20">
                <Activity className="w-3.5 h-3.5" /> LLM Observability & Benchmarking
              </div>
              <h3 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
                LangSmith — <span className="text-emerald-400">Tracing & RAG Debugging</span> Lab
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Auto-tracing execution, nested span trees, custom tags, token cost auditing, and RAG optimization across 4 iterations on statistical text corpora.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['LangSmith', 'Auto-Tracing', 'Span Trees', 'FAISS', 'Mistral AI', 'RAG Optimization'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-emerald-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#08090B] border border-emerald-500/30 text-emerald-400 font-mono text-center space-y-2 w-full md:w-64 shadow-lg">
              <div className="text-3xl font-black">5 EXPERIMENTS</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Simple Traces to PDF RAG v4</div>
              <div className="text-xs text-emerald-300 pt-2 border-t border-[#1D222B]">LangChain Observability</div>
            </div>
          </div>
        </div>
      );

    case 'genai-hero':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-8 bg-gradient-to-br from-[#1B180E] via-[#0D1117] to-[#241F10]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Generative AI & LCEL Pipelines
              </div>
              <h3 className="text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
                Generative AI — <span className="text-amber-400">RAG, ChromaDB & LCEL</span> Hub
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                PyPDF/Text/Web loaders, RecursiveCharacterTextSplitter, ChromaDB vector indexing, LCEL pipe runnables, and Streamlit agent UI dashboards.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Generative AI', 'LangChain', 'LCEL', 'ChromaDB', 'Groq', 'Streamlit', 'Mistral AI'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-[#161B26] border border-[#1D222B] text-[11px] font-mono text-amber-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#08090B] border border-amber-500/30 text-amber-400 font-mono text-center space-y-2 w-full md:w-64 shadow-lg">
              <div className="text-3xl font-black">RAG + LCEL</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Document Ingestion & Agents</div>
              <div className="text-xs text-amber-300 pt-2 border-t border-[#1D222B]">Modular AI Codebase</div>
            </div>
          </div>
        </div>
      );

    default: {
      const isUrl = src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:'));

      if (!isUrl) {
        // Fallback for non-URL identifier tags (prevents browser broken image icons)
        return (
          <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl p-6 sm:p-8 bg-gradient-to-br from-[#0D1117] via-[#11141A] to-[#161B26]">
            <div className="flex items-center justify-between border-b border-[#1D222B] pb-4 mb-4 font-mono text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[#6C8CFF] font-bold ml-2">// SYSTEM MODULE</span>
              </div>
              <span className="text-emerald-400">HANDS-ON LAB</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-xl sm:text-2xl font-extrabold text-[#F5F7FA] tracking-tight">
                {alt || src.replace(/-/g, ' ').toUpperCase()}
              </h4>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-mono">
                Hands-on engineering module — view detailed code patterns, execution logs, and architecture in the repository.
              </p>
            </div>
          </div>
        );
      }

      // Fallback for normal markdown image URLs
      return (
        <figure className="my-8 space-y-2">
          <img
            src={src}
            alt={alt || 'Article screenshot'}
            className="w-full rounded-xl border border-[#1D222B] shadow-xl"
          />
          {alt && (
            <figcaption className="text-center font-mono text-xs text-[#6B7280]">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }
  }
}

function Laptop(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  );
}
