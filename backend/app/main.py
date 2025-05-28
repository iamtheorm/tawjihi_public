from typing import Annotated, List, Dict
from contextlib import asynccontextmanager
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import Base, engine, get_db
from app.api.endpoints import (
    auth,
    analytics,
    customers,
    customer_profile,
    recommendations
)

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting application...")
    yield
    # Shutdown
    print("Shutting down application...")

# Create FastAPI app
app = FastAPI(
    title="Tawjih API",
    description="Backend API for Tawjih application",
    version="1.0.0",
    lifespan=lifespan
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
app.include_router(auth.router)
app.include_router(analytics.router)
app.include_router(customers.router)
app.include_router(customer_profile.router)
app.include_router(recommendations.router)
app.include_router(recommendations.segments_router)
app.include_router(recommendations.products_router)

@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {"message": "Welcome to Tawjih API"}