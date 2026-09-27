// Primary article metadata & publication configuration for Shlok.Bam Engineering Journal
// Full article content is served dynamically from the FastAPI database backend (journal.db)

export const JOURNAL_POSTS = [
  {
    id: 1,
    title: "I Built a Full DevOps CI/CD Pipeline from Scratch — Here's Everything That Went Wrong",
    slug: "i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong",
    excerpt: "A honest, detailed walkthrough of building a Flask + Docker + Jenkins + Terraform + AWS project — including every error, every fix, and every 'why is this not working' moment.",
    content_type: "BUILD",
    category: "DevOps",
    tags: ["DevOps", "Docker", "Jenkins", "Terraform", "AWS", "Flask", "MySQL"],
    reading_time: "20 min read",
    status: "PUBLISHED",
    featured: true,
    published_at: "2026-03-14",
    cover_image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: null,
    github_repo: "shlokbam/flask-todo-app"
  },
  {
    id: 2,
    title: "I Built an AI Data Analyst App from Scratch — Here's How I Taught a Flask App to Think",
    slug: "i-built-an-ai-data-analyst-app-from-scratch-here-s-how-i-taught-a-flask-app-to-think",
    excerpt: "A full walkthrough of building DataLens — CSV uploads, Groq/Llama 3.3 70B AI insights, auto-generated charts, user auth, persistent chat history, and PDF export.",
    content_type: "BUILD",
    category: "AI",
    tags: ["AI", "Flask", "Python", "Groq", "Pandas", "Matplotlib", "ReportLab"],
    reading_time: "13 min read",
    status: "PUBLISHED",
    featured: true,
    published_at: "2026-03-25",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: null,
    github_repo: "shlokbam/ai-data-analyst"
  },
  {
    id: 3,
    title: "I Built an AI-Powered Mock Interview Platform from Scratch — Here's Everything That Went Wrong",
    slug: "i-built-an-ai-powered-mock-interview-platform-from-scratch-here-s-everything-that-went-wrong",
    excerpt: "A full walkthrough of building MockVue — React + FastAPI + TiDB Cloud + Groq AI + face-api.js — including every bug, every architectural decision, and every 'why is this not working' moment.",
    content_type: "BUILD",
    category: "AI",
    tags: ["React", "FastAPI", "TiDB", "Groq", "Whisper", "Llama 3.3", "face-api.js", "Vercel"],
    reading_time: "28 min read",
    status: "PUBLISHED",
    featured: true,
    published_at: "2026-04-05",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    author: "Shlok Bam",
    project_slug: null,
    github_repo: "shlokbam/MockVue"
  }
];

export const EXPERIMENTS_DATA = [];

export const PROFILE_DATA = {
  name: "Shlok Bam",
  handle: "shlokbam",
  title: "Software Engineer & System Builder",
  bio: "I like building systems that turn complex problems into simple, reliable software. Focused on AI agents, LLM orchestration, scalable backend architectures, and DevOps CI/CD automation.",
  status: "Currently building AI systems & developer tools",
  location: "Bangalore, India / Remote",
  github: "https://github.com/shlokbam",
  linkedin: "https://linkedin.com/in/shlokbam",
  email: "contact@shlokbam.dev",
  current_focus: [
    "Multi-Agent Orchestration with LangGraph & FastAPI",
    "Automated DevOps CI/CD pipelines & Docker container optimization",
    "High-throughput MySQL & PostgreSQL performance tuning",
    "Modern minimal frontend engineering with React & Vite"
  ],
  tech_stack: {
    languages: ["Python", "JavaScript / TypeScript", "SQL", "HTML/CSS"],
    frameworks: ["FastAPI", "React", "Vite", "Tailwind CSS", "LangGraph", "SQLAlchemy"],
    databases: ["MySQL", "PostgreSQL", "Redis", "SQLite", "Qdrant"],
    tools: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS EC2", "Alembic", "Git"]
  },
  experience: [
    {
      role: "Software Engineering & AI Systems",
      company: "Independent / Engineering Labs",
      period: "2024 — Present",
      description: "Architecting autonomous agentic frameworks, multi-tenant FastAPI backends, and full-stack technical platforms."
    },
    {
      role: "DevOps & Software Systems Engineer",
      company: "Technology Projects",
      period: "2023 — 2024",
      description: "Designed high-throughput data ingestion pipelines, automated Jenkins + Docker + Terraform CI/CD container builds, and relational schema migrations."
    }
  ]
};
