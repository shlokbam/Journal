from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class TagSchema(BaseModel):
    id: Optional[int] = None
    name: str
    slug: str

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    content_type: str = "BUILD"
    category: Optional[str] = "AI"
    status: str = "PUBLISHED"
    reading_time: str = "5 min read"
    featured: bool = False
    cover_image: Optional[str] = None
    author: str = "Shlok Bam"
    project_slug: Optional[str] = None
    github_repo: Optional[str] = None
    published_at: Optional[str] = None
    tags: List[str] = []

class PostCreate(PostBase):
    pass

class PostOut(PostBase):
    id: int

    class Config:
        from_attributes = True

class BuildLogSchema(BaseModel):
    id: Optional[int] = None
    version: str
    title: str
    description: str
    date: str

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    slug: str
    short_description: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    github_owner: Optional[str] = None
    github_repo: Optional[str] = None
    cover_image: Optional[str] = None
    status: str = "Active"
    featured: bool = False
    build_logs: List[BuildLogSchema] = []
    github_data: Optional[Dict[str, Any]] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class ExperimentSchema(BaseModel):
    id: int
    title: str
    slug: str
    date: str
    status: str
    summary: str
    findings: List[str]
    metrics: Dict[str, str]
    tags: List[str]

    class Config:
        from_attributes = True

class SearchResponse(BaseModel):
    posts: List[PostOut]
    projects: List[ProjectOut]
    experiments: List[ExperimentSchema]

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
