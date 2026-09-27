import React from 'react';
import { Terminal, CheckCircle2, AlertCircle, ExternalLink, Server, Cpu, Database, GitBranch, Layers, Activity } from 'lucide-react';
import { Github } from '../ui/Icons';

export function ArticleImageEmbed({ src, alt }) {
  // Render custom screenshot / diagram cards based on image src identifier
  switch (src) {
    case 'hero-banner':
      return (
        <div className="my-8 rounded-2xl overflow-hidden bg-[#0D1117] border border-[#1D222B] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Terminal Pane */}
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

            {/* Right Card Header Pane */}
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
                  <span>@shlokbam.hashnode.dev</span>
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
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
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

            {/* Step 4 */}
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

            {/* Step 5 */}
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

            {/* Container Row 1 */}
            <div className="grid grid-cols-12 gap-2 text-[11px] py-1 border-b border-[#1D222B]/40 items-center">
              <span className="col-span-2 text-amber-300">0b3f03244c40</span>
              <span className="col-span-3 text-[#F5F7FA]">flask-todo-app-flask</span>
              <span className="col-span-2 text-[#6B7280]">"python app.py"</span>
              <span className="col-span-2 text-emerald-400 font-semibold">Up 17 hours</span>
              <span className="col-span-3 text-[#6C8CFF]">0.0.0.0:5000-&gt;5000/tcp (flask-app)</span>
            </div>

            {/* Container Row 2 */}
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
            {/* Stage 1 */}
            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">1. Clone Code</span>
                <span className="text-emerald-400 font-bold">0.87s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">git branch: 'main'</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">2. Build Image</span>
                <span className="text-emerald-400 font-bold">5m 12s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">docker build -t flask-todo-app</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-xl bg-[#11141A] border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span className="font-semibold text-[#F5F7FA]">3. Deploy Compose</span>
                <span className="text-emerald-400 font-bold">5m 48s</span>
              </div>
              <div className="text-[11px] text-[#6B7280]">docker compose up -d</div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] w-fit font-bold">✓ PASSED</div>
            </div>

            {/* Stage 4 */}
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
          {/* Simulated Browser Bar */}
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

          {/* Live Task Manager UI Preview */}
          <div className="p-8 bg-[#F8FAFC] text-slate-900 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Task Manager</h2>
              <p className="text-xs text-slate-500">
                A simple DevOps demo app — Website (Flask + MySQL) + Containerized (Docker) + Automated CI/CD (Jenkins) + AWS Setup (Terraform)
              </p>
            </div>

            {/* Stat Counters */}
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

            {/* Input Form */}
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

            {/* Task List */}
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

    default:
      // Fallback for normal markdown images
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
