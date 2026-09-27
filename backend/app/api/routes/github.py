from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.github_service import function_get_github_repo_info

router = APIRouter()

@router.get("/{owner}/{repo}")
async def get_github_repo_route(owner: str, repo: str, db: Session = Depends(get_db)):
    data = await function_get_github_repo_info(owner, repo, db)
    return data
