import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Experiment
from app.schemas.schemas import ExperimentSchema

router = APIRouter()

@router.get("", response_model=List[ExperimentSchema])
def get_experiments(db: Session = Depends(get_db)):
    exps = db.query(Experiment).all()
    result = []
    for e in exps:
        findings_list = json.loads(e.findings) if e.findings.startswith("[") else [f.strip() for f in e.findings.split("\n") if f.strip()]
        metrics_dict = json.loads(e.metrics) if e.metrics.startswith("{") else {}
        result.append({
            "id": e.id,
            "title": e.title,
            "slug": e.slug,
            "date": e.date,
            "status": e.status,
            "summary": e.summary,
            "findings": findings_list,
            "metrics": metrics_dict,
            "tags": ["LLM", "Benchmark", "Research"]
        })
    return result
