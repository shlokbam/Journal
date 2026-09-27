import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Shlok.Bam Personal Tech Journal API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-shlokbam-journal-key-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database URL default to SQLite for instant out-of-the-box local dev fallback, configurable to MySQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./journal.db")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")

    class Config:
        case_sensitive = True

settings = Settings()
