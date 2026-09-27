from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.schemas.schemas import Token, UserLogin
from app.models.models import User

router = APIRouter()

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    
    # If user table doesn't exist or default admin isn't created yet, allow fallback for 'admin' or 'shlok'
    if not user:
        if credentials.username in ["admin", "shlok"] and credentials.password in ["admin", "shlok123", "password"]:
            access_token = create_access_token(data={"sub": credentials.username})
            return {"access_token": access_token, "token_type": "bearer"}
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
