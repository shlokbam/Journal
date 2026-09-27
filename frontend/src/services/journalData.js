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
  title: "Information Technology Student & System Builder",
  bio: "Third-Year IT Student at VIT Pune (9.01 CGPA). Building Agentic AI pipelines, multi-stage orchestration systems, scalable full-stack applications, and DevOps containerized infrastructure.",
  status: "Currently building AI systems & developer tools",
  portfolio_url: "https://portfolio-edaa.onrender.com/",
  github: "https://github.com/shlokbam",
  linkedin: "https://linkedin.com/in/shlokbam",
  email: "shlokbam19103@gmail.com",
  current_focus: [
    "Agentic AI Systems & RAG Orchestration at PharmaACE Innovations",
    "Founding Chairperson of ITSA (Information Technology Student's Association)",
    "Multi-Agent AI Pipelines with LangChain, LangGraph & Mistral AI",
    "Containerized DevOps Pipelines with Docker, Jenkins & AWS"
  ],
  tech_stack: {
    languages: ["Python", "C++", "C", "Java", "JavaScript", "SQL"],
    frameworks: ["FastAPI", "Flask", "React", "Node.js", "LangChain", "LangGraph", "Gemini API"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Vector DBs"],
    tools: ["Docker", "Jenkins", "Kubernetes", "Terraform", "AWS", "GCP", "Git"]
  },
  experience: [
    {
      role: "Agentic AI Intern",
      company: "PharmaACE Innovations",
      period: "2025 — Present",
      description: "Engineering Agentic AI systems and multi-stage orchestration pipelines. Designing RAG architectures, prompt engineering components, and robust backend data processing workflows."
    },
    {
      role: "Founding Chairperson",
      company: "ITSA (Information Technology Student's Association), VIT Pune",
      period: "2024 — Present",
      description: "Leading committee initiatives, technical workshops, hackathon teams, and student mentorship in software development and cloud technologies."
    },
    {
      role: "Co-Inventor (3 Patents)",
      company: "CIPC South Africa & IPO India",
      period: "2024 — 2025",
      description: "Co-invented 3 published/granted patents covering AI Wildlife Protection using YOLO, Automated Produce Quality Classification, and Next-Gen TKPH Heavy Machinery Tire Management."
    }
  ]
};
