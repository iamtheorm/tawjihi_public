from typing import Annotated, List, Dict

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models import models
from app.api.endpoints.auth import router as auth_router
from app.db.database import engine, get_db
from app.schemas.schemas import UserResponse
from app.core.security import get_current_user

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Tawjih API",
    description="Backend API for Tawjih application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)

@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {"message": "Welcome to Tawjih API"} 