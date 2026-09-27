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
