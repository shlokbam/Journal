import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.models import Post, Tag, Project, BuildLog, Experiment

from app.api.routes import posts, projects, experiments, github

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include public content routers
app.include_router(posts.router, prefix=f"{settings.API_V1_STR}/posts", tags=["posts"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(experiments.router, prefix=f"{settings.API_V1_STR}/experiments", tags=["experiments"])
app.include_router(github.router, prefix=f"{settings.API_V1_STR}/github", tags=["github"])

@app.on_event("startup")
def on_startup():
    # Create database tables automatically
    Base.metadata.create_all(bind=engine)
    
    # Initial Data Seeding
    db = SessionLocal()
    try:
        # Seed sample posts if empty
        if db.query(Post).count() == 0:
            sample_post1 = Post(
                title="Building an AI Business Analytics Copilot: Multi-Agent Orchestration & SQL Synthesis",
                slug="building-an-ai-business-analytics-copilot",
                excerpt="How I designed a multi-stage agentic pipeline using LangGraph and FastAPI to transform unstructured business requirements into verified SQL queries and visual forecasts.",
                content="""# Introduction

Modern business analytics often suffers from a classic bottleneck: decision-makers need answers from database warehouses, but data teams are overwhelmed with ad-hoc SQL query requests.

To bridge this gap, I designed and built **ABAC (AI Business Analytics Copilot)** — an autonomous multi-agent pipeline that transforms high-level natural language questions into deterministic SQL queries, validates schema constraints, executes dry runs against a data warehouse, and synthesizes executive summary reports.

---

## Architecture Overview

Rather than relying on a single monolithic prompt, ABAC splits the reasoning process into specialized micro-agents running on top of **FastAPI** and **LangGraph**:

1. **Schema Retriever Agent**: Maps user intent to relevant table schemas, foreign key relationships, and metadata definitions using vector similarity.
2. **SQL Generation Agent**: Generates dialect-specific SQL (MySQL / PostgreSQL / BigQuery) with strict CTE structures and aggregations.
3. **Validator & Execution Guard**: Runs SQL AST parsing to block destructive state mutations (`DROP`, `DELETE`, `UPDATE`) and verifies query safety against a read-only database replica.
4. **Insight Synthesis Agent**: Summarizes the resulting dataset into clear natural language insights, complete with automatically generated data visualization configs.

```python
from typing import TypedDict, List
from langgraph.graph import StateGraph, END

class State(TypedDict):
    question: str
    schema_context: List[str]
    generated_sql: str
    is_valid: bool
    results: List[dict]
    summary: str
```
""",
                content_type="BUILD",
                category="AI",
                reading_time="8 min read",
                status="PUBLISHED",
                featured=True,
                project_slug="abac",
                github_repo="shlokbam/abac-copilot"
            )

            sample_post2 = Post(
                title="Testing 5 LLMs for Structured Data Extraction & Schema Alignment",
                slug="testing-5-llms-for-structured-data-extraction",
                excerpt="An empirical benchmarking study analyzing accuracy, latency, token consumption, and Pydantic schema compliance across Claude 3.5 Sonnet, GPT-4o, Qwen 2.5, Llama 3.3, and DeepSeek R1.",
                content="# Empirical LLM Evaluation: Structured JSON & Pydantic Extraction\n\nBenchmarking 500 complex medical & financial documents.",
                content_type="EXPLORE",
                category="AI",
                reading_time="6 min read",
                status="PUBLISHED",
                featured=True
            )

            db.add_all([sample_post1, sample_post2])

        # Seed sample projects if empty
        if db.query(Project).count() == 0:
            pr1 = Project(
                name="ABAC",
                slug="abac",
                short_description="AI Business Analytics Copilot for multi-stage SQL synthesis, execution verification, and dynamic reporting.",
                description="ABAC is a production-grade multi-agent system designed to bridge the gap between non-technical decision makers and complex relational database warehouses.",
                technologies=json.dumps(["Python", "FastAPI", "LangGraph", "LLMs", "MySQL", "React"]),
                github_url="https://github.com/shlokbam/abac-copilot",
                github_owner="shlokbam",
                github_repo="abac-copilot",
                status="Active",
                featured=True
            )
            db.add(pr1)
            db.flush()

            bl1 = BuildLog(project_id=pr1.id, version="v0.1", title="Concept & Baseline Schema Engine", date="2026-06-10", description="Initial proof of concept.")
            bl2 = BuildLog(project_id=pr1.id, version="v0.2", title="LangGraph Multi-Agent Transition", date="2026-07-04", description="Decomposed single prompt into schema retriever, SQL generator, and guard validator nodes.")
            db.add_all([bl1, bl2])

        # Seed sample experiments if empty
        if db.query(Experiment).count() == 0:
            exp1 = Experiment(
                title="Quantization vs. Latency: Llama 3.3 70B Benchmark",
                slug="quantization-vs-latency-llama-3-3",
                date="2026-09-15",
                status="Completed",
                summary="Evaluating token generation speed, VRAM memory footprint, and perplexity across GGUF and AWQ quantizations on an RTX 4090.",
                findings=json.dumps(["Q4_K_M delivers 3.2x faster generation.", "VRAM footprint dropped to 42GB."]),
                metrics=json.dumps({"Q4_K_M Speed": "48 tok/s", "Perplexity Delta": "+0.08"})
            )
            db.add(exp1)

        db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "author": "Shlok Bam",
        "docs": "/docs"
    }
