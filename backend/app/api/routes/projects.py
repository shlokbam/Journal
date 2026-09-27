import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Project, BuildLog
from app.schemas.schemas import ProjectOut, ProjectCreate
from app.services.github_service import function_get_github_repo_info

router = APIRouter()

@router.get("", response_model=List[ProjectOut])
async def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    result = []
    for pr in projects:
        tech_list = json.loads(pr.technologies) if pr.technologies.startswith("[") else [t.strip() for t in pr.technologies.split(",")]
        github_data = None
        if pr.github_owner and pr.github_repo:
            github_data = await function_get_github_repo_info(pr.github_owner, pr.github_repo, db)
            
        logs = [
            {"id": bl.id, "version": bl.version, "title": bl.title, "description": bl.description, "date": bl.date}
            for bl in pr.build_logs
        ]
        
        result.append({
            "id": pr.id,
            "name": pr.name,
            "slug": pr.slug,
            "short_description": pr.short_description,
            "description": pr.description,
            "technologies": tech_list,
            "github_url": pr.github_url,
            "live_url": pr.live_url,
            "github_owner": pr.github_owner,
            "github_repo": pr.github_repo,
            "cover_image": pr.cover_image,
            "status": pr.status,
            "featured": pr.featured,
            "build_logs": logs,
            "github_data": github_data
        })
    return result

@router.get("/{slug}", response_model=ProjectOut)
async def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    pr = db.query(Project).filter(Project.slug == slug).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Project not found")

    tech_list = json.loads(pr.technologies) if pr.technologies.startswith("[") else [t.strip() for t in pr.technologies.split(",")]
    github_data = None
    if pr.github_owner and pr.github_repo:
        github_data = await function_get_github_repo_info(pr.github_owner, pr.github_repo, db)

    logs = [
        {"id": bl.id, "version": bl.version, "title": bl.title, "description": bl.description, "date": bl.date}
        for bl in pr.build_logs
    ]

    return {
        "id": pr.id,
        "name": pr.name,
        "slug": pr.slug,
        "short_description": pr.short_description,
        "description": pr.description,
        "technologies": tech_list,
        "github_url": pr.github_url,
        "live_url": pr.live_url,
        "github_owner": pr.github_owner,
        "github_repo": pr.github_repo,
        "cover_image": pr.cover_image,
        "status": pr.status,
        "featured": pr.featured,
        "build_logs": logs,
        "github_data": github_data
    }
