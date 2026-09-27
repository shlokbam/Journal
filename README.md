<div align="center">

# SHLOK.BAM — Personal Tech Journal & Engineering Universe

### *BUILD · THINK · EXPLORE*

A futuristic, minimal, editorial-grade engineering publication and research notebook. Designed to showcase deep-dive technical articles, AI agent architecture breakdowns, real-world postmortems, and empirical lab experiments.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 🎨 Visual Design Philosophy & Design System

The platform is designed like a modern developer tool + high-end editorial publication (akin to Vercel, Linear, and Stripe Press):

* **Color Palette**:
  * **Background / Root**: `#08090B` (Dark obsidian)
  * **Secondary Surface**: `#0D1117` (Deep slate)
  * **Card Surface**: `#11141A` (Card base)
  * **Border Grid**: `#1D222B` (Subtle structural grid lines)
  * **Primary Text**: `#F5F7FA` (Crisp off-white)
  * **Muted Subtext**: `#9CA3AF` (Secondary zinc)
  * **Accent Highlight**: `#6C8CFF` (Restrained electric indigo)
* **Typography Hierarchy**:
  * **Headlines & Interface**: `Plus Jakarta Sans` / `Inter`
  * **Metadata, Tags, & Code**: `JetBrains Mono`
* **Micro-Interactions**: Smooth entrance reveals via Framer Motion, glassmorphism backdrop blur navigation, number-indexed editorial signal lists (`01`, `02`...), and hover accents.

---

## ⚡ Key Features

- 🔍 **`⌘K` / `Ctrl+K` Command Palette**: Instant modal search across all journal articles and lab experiments with keyboard arrow navigation.
- ⚡ **Editorial Homepage (`/`)**: High-impact hero section, live building status pill (`● Currently building`), latest engineering signals list, and lab benchmark callouts.
- 📰 **The Journal (`/journal`)**: Filterable content repository by categories (`BUILD`, `THINK`, `LEARN`, `EXPLORE`, `INDUSTRY`), search query, and interactive tech tags cloud (`#DevOps`, `#Docker`, `#FastAPI`, `#LangGraph`).
- 📖 **Publication-Grade Article Reader (`/journal/:slug`)**: Full GFM Markdown rendering, syntax-highlighted code blocks ([`highlight.js`](https://highlightjs.org/)), share link copier, and desktop **Sticky Table of Contents (`ON THIS PAGE`)** with scroll-synced section highlighting.
- 🧪 **Lab Experiments Notebook (`/experiments`)**: Empirical benchmarking dashboard tracking model generation speeds (tok/s), VRAM footprints, vector database p99 latencies, and AST safety tests.
- 👨‍💻 **About Section (`/about`)**: Personal engineering philosophy (*"I like building things that turn complex problems into simple systems"*), current focus, technology stack matrix, and experience timeline.

---

## 🛠️ Technology Stack

### Frontend
- **Core Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **Styling & Design System**: Tailwind CSS v4 + Custom Tech Grid overlays
- **Animations**: Framer Motion
- **Icons**: Lucide React + Custom SVG Icon Components
- **Markdown Processing**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js`

### Backend
- **Framework**: Python 3.13 + FastAPI
- **ORM & Database**: SQLAlchemy 2.0 + Alembic migrations (MySQL / SQLite fallback)
- **Data Validation**: Pydantic v2
- **External Integration**: GitHub REST API with a 6-hour database caching layer

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js `v18+` & `npm`
- Python `3.10+`

### 1. Clone & Setup Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend will launch at `http://localhost:5173` (or `http://localhost:5174`).

### 2. Setup FastAPI Backend
```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python requirements
pip install -r requirements.txt

# Run FastAPI server
python3 -m app.main
```
The FastAPI server will launch at `http://localhost:8000` with interactive OpenAPI Swagger documentation available at `http://localhost:8000/docs`.

### 3. Run with Docker Compose (MySQL + Backend + Frontend)
```bash
docker-compose up --build
```

---

## 📂 Project Architecture

```text
Journal/
├── frontend/                  # React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── articles/      # ArticleCard, TableOfContents
│   │   │   ├── navigation/    # Navbar, CommandPalette
│   │   │   ├── layout/        # Footer
│   │   │   └── ui/            # Badge, TechTag, Icons (Github, Linkedin)
│   │   ├── pages/             # Home, Journal, ArticleDetail, Experiments, About
│   │   ├── services/          # api.js, mockData.js
│   │   ├── index.css          # Custom Tailwind v4 theme & prose styles
│   │   └── App.jsx            # React Router setup & main layout
│   └── vite.config.js
├── backend/                   # FastAPI Server Application
│   ├── app/
│   │   ├── api/routes/        # posts, experiments, github
│   │   ├── core/              # config, database, security
│   │   ├── models/            # SQLAlchemy database ORM models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   └── main.py            # FastAPI entrypoint & auto-seeding logic
│   ├── alembic/               # Database migration scripts
│   ├── alembic.ini
│   └── requirements.txt
├── docker-compose.yml         # Containerized local environment
├── .env.example               # Environment variables template
└── README.md                  # Project Documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```ini
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Backend Configuration
DATABASE_URL=sqlite:///./journal.db
JWT_SECRET=super-secret-shlokbam-journal-key-2026
GITHUB_TOKEN=
CORS_ORIGINS=*
```

---

## 📄 Featured Articles Included

1. 🚀 **I Built a Full DevOps CI/CD Pipeline from Scratch — Here's Everything That Went Wrong**
   - *Topics*: Docker layer cache invalidation, AWS IAM OIDC auth, flaky test suites, and Kubernetes rolling update stall rollbacks.
2. 🤖 **Building an AI Business Analytics Copilot: Multi-Agent Orchestration & SQL Synthesis**
   - *Topics*: LangGraph multi-agent nodes, SQL AST parsing with `sqlglot`, and vector schema retrieval.
3. 🧪 **Testing 5 LLMs for Structured Data Extraction & Schema Alignment**
   - *Topics*: Empirical benchmark comparing Claude 3.5 Sonnet, GPT-4o, DeepSeek R1, Qwen 2.5, and Llama 3.3 across Pydantic schema validation.
4. 🛠️ **Why Simple Systems Beat Complex Architectures: Engineering Pragmatism**
   - *Topics*: Microservice fatigue, premature abstractions, and monolithic simplicity.

---

<div align="center">

**SHLOK.BAM** • Crafted with precision by Shlok Bam.

</div>
