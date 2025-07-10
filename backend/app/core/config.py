from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    # JWT settings
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # CORS settings
    # BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]  # frontend URL
    
    class Config:
        case_sensitive = True

settings = Settings() 