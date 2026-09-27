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
    experiments: List[ExperimentSchema]
