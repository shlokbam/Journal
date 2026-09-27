from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Post, Tag, post_tags
from app.schemas.schemas import PostOut, PostCreate

router = APIRouter()

@router.get("", response_model=List[PostOut])
def get_posts(
    type: Optional[str] = None,
    tag: Optional[str] = None,
    query: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Post)
    if type and type != "ALL":
        q = q.filter(Post.content_type == type.upper())
    if tag:
        q = q.join(Post.tags).filter(Tag.name.ilike(f"%{tag}%"))
    if query:
        search_fmt = f"%{query}%"
        q = q.filter((Post.title.ilike(search_fmt)) | (Post.excerpt.ilike(search_fmt)))
    
    posts = q.order_by(Post.id.asc()).all()
    
    result = []
    for p in posts:
        post_dict = {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "excerpt": p.excerpt,
            "content": p.content,
            "content_type": p.content_type,
            "category": p.category,
            "status": p.status,
            "reading_time": p.reading_time,
            "featured": p.featured,
            "cover_image": p.cover_image,
            "author": p.author,
            "project_slug": p.project_slug,
            "github_repo": p.github_repo,
            "published_at": p.published_at,
            "tags": [t.name for t in p.tags]
        }
        result.append(post_dict)
    return result

@router.get("/{slug}", response_model=PostOut)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "excerpt": post.excerpt,
        "content": post.content,
        "content_type": post.content_type,
        "category": post.category,
        "status": post.status,
        "reading_time": post.reading_time,
        "featured": post.featured,
        "cover_image": post.cover_image,
        "author": post.author,
        "project_slug": post.project_slug,
        "github_repo": post.github_repo,
        "published_at": post.published_at,
        "tags": [t.name for t in post.tags]
    }

@router.post("", response_model=PostOut)
def create_post(
    post_in: PostCreate,
    db: Session = Depends(get_db)
):
    post = Post(
        title=post_in.title,
        slug=post_in.slug,
        excerpt=post_in.excerpt,
        content=post_in.content,
        content_type=post_in.content_type,
        category=post_in.category,
        status=post_in.status,
        reading_time=post_in.reading_time,
        featured=post_in.featured,
        cover_image=post_in.cover_image,
        author=post_in.author,
        project_slug=post_in.project_slug,
        github_repo=post_in.github_repo,
        published_at=post_in.published_at
    )
    
    for tag_name in post_in.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name, slug=tag_name.lower().replace(" ", "-"))
            db.add(tag)
        post.tags.append(tag)
        
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "excerpt": post.excerpt,
        "content": post.content,
        "content_type": post.content_type,
        "category": post.category,
        "status": post.status,
        "reading_time": post.reading_time,
        "featured": post.featured,
        "cover_image": post.cover_image,
        "author": post.author,
        "project_slug": post.project_slug,
        "github_repo": post.github_repo,
        "published_at": post.published_at,
        "tags": [t.name for t in post.tags]
    }
