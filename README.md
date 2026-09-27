# SHLOK.BAM — Personal Tech Journal & Engineering Universe

> **BUILD · THINK · EXPLORE**
> A personal engineering publication covering AI systems, multi-agent orchestration, data engineering pipelines, and research experiments.

---

## 1. Visual Design Philosophy & Aesthetics

The platform follows a dark-first, editorial visual design system:
- **Base Surfaces**: `#08090B` (Root), `#0D1117` (Surface), `#11141A` (Cards), `#1D222B` (Borders).
- **Typography**: `Plus Jakarta Sans` / `Inter` for editorial headers and reading text; `JetBrains Mono` for technical metadata, tags, and code blocks.
- **Accents**: Restrained electric indigo (`#6C8CFF`) with micro-animations and zero distracting neon clutter.
- **Reading Experience**: Sticky Table of Contents, syntax-highlighted code blocks, metadata indicators, and GFM markdown formatting.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React + custom SVG icons
- **Markdown & Code Highlighting**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js`

### Backend
- **Framework**: Python 3.13 + FastAPI
- **ORM & Database**: SQLAlchemy 2.0 + Alembic (MySQL / SQLite)
- **Validation**: Pydantic v2
- **External Integration**: GitHub REST API with caching layer

---

## 3. Core Features & Routes

- **`CMD+K` Command Palette**: Instant global search across articles and lab experiments with full keyboard navigation.
- **Editorial Homepage (`/`)**: High-impact editorial hero, latest signals list, and research benchmark callouts.
- **The Journal (`/journal`)**: Filterable content feed by types (`BUILD`, `THINK`, `LEARN`, `EXPLORE`, `INDUSTRY`), search query, and tags.
- **Article Reader (`/journal/:slug`)**: Publication-grade reading experience with scroll-synced Table of Contents.
- **Lab Experiments (`/experiments`)**: Empirical benchmarking notebook for model throughput, vector DB latency, and AST safety tests.
- **About (`/about`)**: Technical focus, technology matrix, and background.

---

## 4. Quick Start (Local Development)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m app.main
```
The FastAPI backend will start at `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.

### Docker Compose
```bash
docker-compose up --build
```

---

## 5. Architecture & Folder Structure

```text
Journal/
├── frontend/                  # React (Vite) Frontend
│   ├── src/
│   │   ├── components/        # ArticleCard, TableOfContents, Navbar, CommandPalette, Footer, Badge, TechTag
│   │   ├── pages/             # Home, Journal, ArticleDetail, Experiments, About
│   │   ├── services/          # api.js, mockData.js
│   │   ├── index.css
│   │   └── App.jsx
│   └── vite.config.js
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── api/routes/        # posts, experiments, github
│   │   ├── core/              # config, database, security
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   └── main.py            # FastAPI entrypoint & auto-seeder
│   ├── alembic/               # Database migrations
│   └── requirements.txt
├── docker-compose.yml
├── .env.example
└── README.md
```
