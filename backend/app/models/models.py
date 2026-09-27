from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

post_tags = Table(
    'post_tags',
    Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(50), default="BUILD", index=True) # BUILD, THINK, LEARN, EXPLORE, INDUSTRY
    category = Column(String(100), nullable=True)
    status = Column(String(50), default="PUBLISHED") # DRAFT, PUBLISHED, ARCHIVED
    reading_time = Column(String(50), default="5 min read")
    featured = Column(Boolean, default=False)
    cover_image = Column(String(500), nullable=True)
    author = Column(String(100), default="Shlok Bam")
    project_slug = Column(String(255), nullable=True)
    github_repo = Column(String(255), nullable=True)
    published_at = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tags = relationship("Tag", secondary=post_tags, back_populates="posts")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    slug = Column(String(50), unique=True, index=True, nullable=False)

    posts = relationship("Post", secondary=post_tags, back_populates="tags")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(Text, nullable=False) # stored as json or comma separated
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    github_owner = Column(String(100), nullable=True)
    github_repo = Column(String(100), nullable=True)
    cover_image = Column(String(500), nullable=True)
    status = Column(String(50), default="Active")
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    build_logs = relationship("BuildLog", back_populates="project", cascade="all, delete-orphan")

class BuildLog(Base):
    __tablename__ = "build_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    version = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String(50), nullable=False)

    project = relationship("Project", back_populates="build_logs")

class Experiment(Base):
    __tablename__ = "experiments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    date = Column(String(50), nullable=False)
    status = Column(String(50), default="Completed")
    summary = Column(Text, nullable=False)
    findings = Column(Text, nullable=False) # JSON or newline string
    metrics = Column(Text, nullable=False)  # JSON string

class GithubCache(Base):
    __tablename__ = "github_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String(100), nullable=False)
    repo = Column(String(100), nullable=False)
    data = Column(Text, nullable=False) # JSON
    last_fetched_at = Column(DateTime, default=datetime.utcnow)
