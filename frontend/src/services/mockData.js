// Mock content for Shlok.Bam Personal Tech Journal & Engineering Universe

export const MOCK_POSTS = [
  {
    id: 1,
    title: "Building an AI Business Analytics Copilot: Multi-Agent Orchestration & SQL Synthesis",
    slug: "building-an-ai-business-analytics-copilot",
    excerpt: "How I designed a multi-stage agentic pipeline using LangGraph and FastAPI to transform unstructured business requirements into verified SQL queries and visual forecasts.",
    content: `
# Introduction

Modern business analytics often suffers from a classic bottleneck: decision-makers need answers from database warehouses, but data teams are overwhelmed with ad-hoc SQL query requests.

To bridge this gap, I designed and built **ABAC (AI Business Analytics Copilot)** — an autonomous multi-agent pipeline that transforms high-level natural language questions into deterministic SQL queries, validates schema constraints, executes dry runs against a data warehouse, and synthesizes executive summary reports.

---

## Architecture Overview

Rather than relying on a single monolithic prompt, ABAC splits the reasoning process into specialized micro-agents running on top of **FastAPI** and **LangGraph**:

1. **Schema Retriever Agent**: Maps user intent to relevant table schemas, foreign key relationships, and metadata definitions using vector similarity.
2. **SQL Generation Agent**: Generates dialect-specific SQL (MySQL / PostgreSQL / BigQuery) with strict CTE structures and aggregations.
3. **Validator & Execution Guard**: Runs SQL AST parsing to block destructive state mutations (\`DROP\`, \`DELETE\`, \`UPDATE\`) and verifies query safety against a read-only database replica.
4. **Insight Synthesis Agent**: Summarizes the resulting dataset into clear natural language insights, complete with automatically generated data visualization configs.

\`\`\`python
# Multi-agent node definition snippet
from typing import TypedDict, List
from langgraph.graph import StateGraph, END

class State(TypedDict):
    question: str
    schema_context: List[str]
    generated_sql: str
    is_valid: bool
    results: List[dict]
    summary: str

builder = StateGraph(State)
builder.add_node("retrieve_schema", retrieve_schema_node)
builder.add_node("generate_sql", generate_sql_node)
builder.add_node("validate_sql", validate_sql_node)
builder.add_node("execute_query", execute_query_node)

builder.add_edge("retrieve_schema", "generate_sql")
builder.add_edge("generate_sql", "validate_sql")
builder.add_conditional_edges(
    "validate_sql",
    lambda s: "execute_query" if s["is_valid"] else "generate_sql"
)
\`\`\`

---

## Key Challenges & Lessons

### 1. Schema Drift & Ambiguity
LLMs frequently hallucinate column names when schemas grow beyond 50+ tables. Using semantic chunking of column docstrings reduced schema hallucinations by **84%**.

### 2. Deterministic SQL Execution
Prompting alone is not enough for production accuracy. Implementing AST validation via \`sqlglot\` ensured zero malicious or syntax-broken queries reached the database level.

---

## Results & Benchmarks

On an internal benchmark suite of 150 complex analytical queries:
- **Execution Success Rate**: 93.4%
- **Mean Latency**: 2.4 seconds per query
- **Schema Mapping Precision**: 96.1%
`,
    content_type: "BUILD",
    category: "AI",
    tags: ["AI", "Agents", "FastAPI", "SQL", "LangGraph"],
    reading_time: "8 min read",
    status: "PUBLISHED",
    featured: true,
    published_at: "2026-09-27",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: "abac",
    github_repo: "shlokbam/abac-copilot"
  },
  {
    id: 2,
    title: "Testing 5 LLMs for Structured Data Extraction & Schema Alignment",
    slug: "testing-5-llms-for-structured-data-extraction",
    excerpt: "An empirical benchmarking study analyzing accuracy, latency, token consumption, and Pydantic schema compliance across Claude 3.5 Sonnet, GPT-4o, Qwen 2.5, Llama 3.3, and DeepSeek R1.",
    content: `
# Empirical LLM Evaluation: Structured JSON & Pydantic Extraction

Extracting strictly validated JSON objects from noisy unstructured documents (PDFs, invoice scans, web pages) is a core requirement in enterprise AI pipelines.

In this experiment, I evaluated five state-of-the-art models on a benchmark set of **500 complex medical & financial documents**.

---

## Benchmark Metrics

Models were evaluated across four core dimensions:
1. **Schema Compliance**: Percentage of responses passing \`Pydantic.BaseModel.model_validate_json()\`.
2. **Field Extraction Accuracy**: Micro F1-score across nested JSON attributes.
3. **Latency (TTFT & Total)**: Time-to-first-token and total generation time.
4. **Cost Efficiency**: Total token expense per 1,000 extractions.

---

## Key Findings

| Model | Schema Compliance | F1 Score | Avg Latency | Cost / 1k docs |
| :--- | :--- | :--- | :--- | :--- |
| **Claude 3.5 Sonnet** | 99.8% | **96.4%** | 1.8s | \$3.20 |
| **GPT-4o** | 99.4% | 94.8% | **1.2s** | \$2.50 |
| **DeepSeek R1** | 98.2% | 95.1% | 3.4s | **\$0.55** |
| **Qwen 2.5 72B (Local)** | 97.6% | 91.2% | 2.1s | Self-hosted |
| **Llama 3.3 70B** | 96.8% | 90.5% | 1.9s | Self-hosted |

---

## Takeaways & Production Recommendation

For mission-critical production pipelines requiring zero schema failures, **Claude 3.5 Sonnet** remains the gold standard. However, for cost-sensitive high-throughput extraction workloads, pairing **DeepSeek R1** for initial extraction with local **Qwen 2.5** verification offers a 5x cost reduction with minimal accuracy degradation.
`,
    content_type: "EXPLORE",
    category: "AI",
    tags: ["LLM", "Benchmarking", "Pydantic", "Python", "Data"],
    reading_time: "6 min read",
    status: "PUBLISHED",
    featured: true,
    published_at: "2026-09-20",
    cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: null,
    github_repo: null
  },
  {
    id: 3,
    title: "Why Simple Systems Beat Complex Architectures: Engineering Pragmatism",
    slug: "why-simple-systems-beat-complex-architectures",
    excerpt: "Reflections on microservice fatigue, Premature Abstraction, and why simple monorepos with PostgreSQL and background workers outlive complex distributed systems.",
    content: `
# Engineering Pragmatism in the Age of Over-Engineering

It is easy to make a software system complex. It takes deep discipline to keep it simple.

Over the past few years, the software industry has developed a bias toward architectural complexity — introducing Kafka topics for simple event queues, Kubernetes clusters for single backend apps, and microservice meshes before product-market fit.

---

## The Hidden Cost of Microservice Fatigue

When systems are prematurely split into microservices:
- **Observability complexity explodes**: Tracing a single user request requires distributed logging and telemetry.
- **Transactional integrity suffers**: Replacing ACID database transactions with saga patterns introduces edge-case failure modes.
- **Developer velocity slows down**: Local setup requires 15 Docker containers running simultaneously.

---

## The Pragmatic Tech Stack

For 90% of engineering applications:
1. **Monolithic FastAPI / Node.js backend**: Clean modular layout, simple testing, fast local execution.
2. **PostgreSQL / MySQL with JSONB & Indexes**: Single source of truth with relational integrity and flexible JSON fields.
3. **Redis + Celery / Background Workers**: Async job execution without complex message brokers.
4. **Vite / React Frontend**: Fast client-side rendering with static asset caching.

Keep it simple until operational metrics prove you need distributed scaling.
`,
    content_type: "THINK",
    category: "Architecture",
    tags: ["Engineering", "Architecture", "Python", "Database"],
    reading_time: "5 min read",
    status: "PUBLISHED",
    featured: false,
    published_at: "2026-09-14",
    cover_image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: null,
    github_repo: null
  },
  {
    id: 4,
    title: "Designing a Scalable Real-Time Data Pipeline with Python & FastAPI",
    slug: "designing-a-scalable-real-time-data-pipeline",
    excerpt: "Architecting an event-driven ingestion engine capable of processing 10,000+ records/sec with MySQL batching and Redis memory buffers.",
    content: `
# High-Throughput Data Ingestion Pipelines

Data pipelines often degrade when stream processing rate outpaces database connection pools. In this article, I break down the ingestion strategy I implemented for processing real-time telemetry events.

## Pipeline Architecture

- **Ingestion Layer**: Asynchronous FastAPI endpoints consuming WebSockets & HTTP POST queues.
- **Buffer Layer**: Redis streams with rolling memory windows.
- **Processing Layer**: Celery worker nodes performing Schema Validation and deduplication.
- **Storage Layer**: MySQL with dynamic bulk upsert partitioning.

\`\`\`python
# Dynamic bulk upsert in SQLAlchemy
from sqlalchemy import insert

def bulk_upsert_events(db_session, event_dicts):
    stmt = insert(TelemetryModel).values(event_dicts)
    update_dict = {
        col.name: stmt.inserted[col.name]
        for col in TelemetryModel.__table__.columns
        if not col.primary_key
    }
    upsert_stmt = stmt.on_duplicate_key_update(**update_dict)
    db_session.execute(upsert_stmt)
    db_session.commit()
\`\`\`
`,
    content_type: "LEARN",
    category: "Data",
    tags: ["Data Engineering", "FastAPI", "MySQL", "Redis", "Python"],
    reading_time: "7 min read",
    status: "PUBLISHED",
    featured: false,
    published_at: "2026-09-02",
    cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: "daily-diff",
    github_repo: "shlokbam/dailydiff-engine"
  },
  {
    id: 5,
    title: "NPI Matching System: High Precision Provider Disambiguation Engine",
    slug: "npi-matching-system-high-precision-disambiguation",
    excerpt: "Building a deterministic and fuzzy matching engine in Python to deduplicate 2.5 million healthcare provider records against National Provider Identifier data.",
    content: `
# Deduplicating Healthcare Data at Scale

Entity resolution across millions of noisy unstructured records requires combining deterministic rule filtering with probabilistic fuzzy scoring.

This case study documents the algorithm design behind the NPI (National Provider Identifier) Matching System built using Python, MySQL, and RapidFuzz.

## Disambiguation Pipeline
1. **NPI Registry Ingestion**: Automated syncing with NPUES updates.
2. **Deterministic Pre-filtering**: Exact matching on Taxonomy Codes and Postal Zip blocks.
3. **Token Set Ratio & Jaro-Winkler Scoring**: Weighted string similarity across provider names and medical practice addresses.
4. **Graph Cluster Disambiguation**: Merging duplicate entities into unified records.
`,
    content_type: "INDUSTRY",
    category: "Systems",
    tags: ["Python", "MySQL", "Data Engineering", "Algorithms"],
    reading_time: "9 min read",
    status: "PUBLISHED",
    featured: false,
    published_at: "2026-08-25",
    cover_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: "npi-matching-system",
    github_repo: "shlokbam/npi-matcher"
  }
];

export const MOCK_PROJECTS = [
  {
    id: 1,
    name: "ABAC",
    slug: "abac",
    short_description: "AI Business Analytics Copilot for multi-stage SQL synthesis, execution verification, and dynamic reporting.",
    description: "ABAC is a production-grade multi-agent system designed to bridge the gap between non-technical decision makers and complex relational database warehouses. It parses natural language prompts, retrieves table schemas using vector embedding search, constructs deterministic SQL queries, runs automated safety checks, and formats findings into visual dashboard components.",
    technologies: ["Python", "FastAPI", "LangGraph", "LLMs", "MySQL", "React", "Tailwind CSS"],
    github_url: "https://github.com/shlokbam/abac-copilot",
    live_url: "https://abac-demo.shlokbam.dev",
    github_owner: "shlokbam",
    github_repo: "abac-copilot",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    status: "Active",
    featured: true,
    github_data: {
      stars: 142,
      forks: 28,
      language: "Python",
      topics: ["ai-agents", "langgraph", "fastapi", "sql-generator", "react"],
      updated_at: "2026-09-26T18:42:00Z",
      description: "Multi-agent SQL synthesis and analytics workflow engine powered by FastAPI & LangGraph."
    },
    build_logs: [
      { id: 1, version: "v0.1", title: "Concept & Baseline Schema Engine", date: "2026-06-10", description: "Initial proof of concept using direct LLM prompts for SQL generation." },
      { id: 2, version: "v0.2", title: "LangGraph Multi-Agent Transition", date: "2026-07-04", description: "Decomposed single prompt into schema retriever, SQL generator, and guard validator nodes." },
      { id: 3, version: "v0.3", title: "AST Guard & Execution Safety", date: "2026-07-28", description: "Integrated sqlglot AST parsing to block unsafe DDL/DML queries and validate CTE references." },
      { id: 4, version: "v0.4", title: "FastAPI Async Pipeline & WebSockets", date: "2026-08-15", description: "Added streaming step-by-step agent execution state over WebSockets to React UI." },
      { id: 5, version: "v0.5", title: "Reasoning Agent & Automated Charts", date: "2026-09-18", description: "Finalized automatic visualization config generation (Recharts/Chart.js json payloads)." }
    ],
    related_posts: [
      { slug: "building-an-ai-business-analytics-copilot", title: "Building an AI Business Analytics Copilot", type: "BUILD" }
    ]
  },
  {
    id: 2,
    name: "DailyDiff",
    slug: "daily-diff",
    short_description: "Automated API & tech documentation change tracker with semantic difference summaries.",
    description: "DailyDiff monitors developer documentation, API schemas, and release notes across 50+ major cloud and developer tools. It detects structural diffs, filters out minor typos, and generates human-readable daily digest summaries using lightweight local LLMs.",
    technologies: ["React", "Vite", "Python", "FastAPI", "BeautifulSoup", "MySQL"],
    github_url: "https://github.com/shlokbam/dailydiff-engine",
    live_url: "https://dailydiff.dev",
    github_owner: "shlokbam",
    github_repo: "dailydiff-engine",
    cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
    status: "Active",
    featured: true,
    github_data: {
      stars: 89,
      forks: 14,
      language: "TypeScript",
      topics: ["developer-tools", "diff-checker", "api-monitoring", "fastapi"],
      updated_at: "2026-09-24T11:15:00Z",
      description: "Automated API & developer documentation difference tracking engine."
    },
    build_logs: [
      { id: 1, version: "v0.1", title: "Web Scraping & Hash Storage", date: "2026-05-12", description: "Basic URL monitoring with SHA256 DOM hash diffing." },
      { id: 2, version: "v0.2", title: "AST & Markdown Parsing", date: "2026-06-20", description: "Improved diff noise filtering by parsing DOM trees into standardized markdown structures." },
      { id: 3, version: "v0.3", title: "LLM Digest Summarization", date: "2026-08-01", description: "Added daily batch summarization via local Llama 3 models." }
    ],
    related_posts: [
      { slug: "designing-a-scalable-real-time-data-pipeline", title: "Designing a Scalable Real-Time Data Pipeline", type: "LEARN" }
    ]
  },
  {
    id: 3,
    name: "Multi-Agent Research System",
    slug: "multi-agent-research-system",
    short_description: "Autonomous deep-dive research workflow that browses arXiv, synthesizes literature, and outputs structured reviews.",
    description: "An open-source research automation engine that executes multi-hop web and paper retrieval, checks citations, clusters research hypotheses, and formats formal markdown technical summaries.",
    technologies: ["Python", "LangGraph", "arXiv API", "FastAPI", "SQLite"],
    github_url: "https://github.com/shlokbam/agentic-researcher",
    live_url: null,
    github_owner: "shlokbam",
    github_repo: "agentic-researcher",
    cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    status: "Completed",
    featured: false,
    github_data: {
      stars: 215,
      forks: 41,
      language: "Python",
      topics: ["arxiv", "research-agent", "langgraph", "llm-agents"],
      updated_at: "2026-09-10T14:30:00Z",
      description: "Deep research agent workflow for academic literature review and synthesis."
    },
    build_logs: [
      { id: 1, version: "v0.1", title: "arXiv API & PDF Parser", date: "2026-04-10", description: "Built PDF text extraction and citation metadata parsing." },
      { id: 2, version: "v0.2", title: "Graph Synthesis Workflow", date: "2026-05-18", description: "Integrated iterative claim verification with vector search." }
    ],
    related_posts: [
      { slug: "testing-5-llms-for-structured-data-extraction", title: "Testing 5 LLMs for Structured Data Extraction", type: "EXPLORE" }
    ]
  },
  {
    id: 4,
    name: "NPI Matching System",
    slug: "npi-matching-system",
    short_description: "High-precision entity resolution engine for matching healthcare provider records against NPUES registries.",
    description: "Healthcare data deduplication pipeline leveraging deterministic rule engines, string similarity distance metrics (Jaro-Winkler / RapidFuzz), and database graph clustering to resolve ambiguous provider records.",
    technologies: ["Python", "MySQL", "SQLAlchemy", "RapidFuzz", "FastAPI"],
    github_url: "https://github.com/shlokbam/npi-matcher",
    live_url: null,
    github_owner: "shlokbam",
    github_repo: "npi-matcher",
    cover_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    status: "Completed",
    featured: false,
    github_data: {
      stars: 64,
      forks: 9,
      language: "Python",
      topics: ["entity-resolution", "npi-registry", "fuzzy-matching", "mysql"],
      updated_at: "2026-08-30T09:20:00Z",
      description: "Deterministic and fuzzy matching engine for healthcare NPI provider datasets."
    },
    build_logs: [
      { id: 1, version: "v0.1", title: "Core Disambiguation Pipeline", date: "2026-03-01", description: "Rule-based filtering with RapidFuzz name and address matching." }
    ],
    related_posts: [
      { slug: "npi-matching-system-high-precision-disambiguation", title: "NPI Matching System Case Study", type: "INDUSTRY" }
    ]
  }
];

export const MOCK_EXPERIMENTS = [
  {
    id: 1,
    title: "Quantization vs. Latency: Llama 3.3 70B Benchmark",
    slug: "quantization-vs-latency-llama-3-3",
    date: "2026-09-15",
    tags: ["LLM", "Quantization", "vLLM", "GPU"],
    status: "Completed",
    summary: "Evaluating token generation speed, VRAM memory footprint, and perplexity across GGUF (Q4_K_M vs Q8_0) and AWQ 4-bit quantizations on an RTX 4090.",
    findings: [
      "Q4_K_M delivers 3.2x faster generation with only 0.8% perplexity degradation over FP16.",
      "VRAM footprint dropped from 140GB (unquantized) to 42GB for 70B models.",
      "vLLM engine with PagedAttention achieved 48 tokens/sec throughput."
    ],
    metrics: {
      "Q4_K_M Speed": "48 tok/s",
      "Q8_0 Speed": "22 tok/s",
      "VRAM Used": "42.4 GB",
      "Perplexity Delta": "+0.08"
    }
  },
  {
    id: 2,
    title: "Vector DB Performance: Qdrant vs. Pgvector at 5M Scale",
    slug: "vector-db-performance-qdrant-vs-pgvector",
    date: "2026-08-28",
    tags: ["Vector Search", "PostgreSQL", "Qdrant", "Database"],
    status: "Completed",
    summary: "Stress-testing HNSW index retrieval times, memory consumption, and p99 query latency across 5,000,000 1536-dimensional embeddings.",
    findings: [
      "Qdrant maintained p99 latency of 14ms with in-memory HNSW index.",
      "Pgvector with HNSW index reached p99 of 28ms while sharing PostgreSQL connection pool.",
      "For unified relational + vector queries, Pgvector simplified architecture with minimal latency trade-off."
    ],
    metrics: {
      "Qdrant p99": "14.2 ms",
      "Pgvector p99": "28.4 ms",
      "Dataset Size": "5,000,000",
      "Memory Usage": "18.2 GB"
    }
  },
  {
    id: 3,
    title: "AST-Guided Prompting for Error-Free Code Synthesis",
    slug: "ast-guided-prompting-for-code-synthesis",
    date: "2026-08-05",
    tags: ["Agents", "AST", "Python", "Prompting"],
    status: "In Progress",
    summary: "Testing iterative feedback loops where LLM code generation is passed into Python's ast module and ruff linter before returning final output.",
    findings: [
      "Reduced syntax runtime errors from 18% down to 0.4%.",
      "Average validation loop takes 1.2 extra cycles when syntax errors occur."
    ],
    metrics: {
      "Syntax Accuracy": "99.6%",
      "Avg Retry Loops": "0.14",
      "Lint Errors Blocked": "340/350"
    }
  }
];

export const MOCK_PROFILE = {
  name: "Shlok Bam",
  handle: "shlokbam",
  title: "Software Engineer & System Builder",
  bio: "I like building systems that turn complex problems into simple, reliable software. Focused on AI agents, LLM orchestration, scalable backend architectures, and high-throughput data engineering.",
  status: "Currently building AI systems & developer tools",
  location: "Bangalore, India / Remote",
  github: "https://github.com/shlokbam",
  linkedin: "https://linkedin.com/in/shlokbam",
  email: "contact@shlokbam.dev",
  current_focus: [
    "Multi-Agent Orchestration with LangGraph & FastAPI",
    "High-throughput MySQL & PostgreSQL performance tuning",
    "AST-guided code and SQL generation safety pipelines",
    "Modern minimal frontend engineering with React & Vite"
  ],
  tech_stack: {
    languages: ["Python", "JavaScript / TypeScript", "SQL", "HTML/CSS"],
    frameworks: ["FastAPI", "React", "Vite", "Tailwind CSS", "LangGraph", "SQLAlchemy"],
    databases: ["MySQL", "PostgreSQL", "Redis", "SQLite", "Qdrant"],
    tools: ["Docker", "Alembic", "Git", "Axiom/Grafana", "Pydantic", "Vercel"]
  },
  experience: [
    {
      role: "Software Engineering & AI Systems",
      company: "Independent / Engineering Labs",
      period: "2024 — Present",
      description: "Architecting autonomous agentic frameworks, multi-tenant FastAPI backends, and full-stack technical platforms."
    },
    {
      role: "Data & Software Systems Engineer",
      company: "Technology Projects",
      period: "2023 — 2024",
      description: "Designed high-throughput data ingestion pipelines, entity resolution engines, and relational schema migrations."
    }
  ]
};
