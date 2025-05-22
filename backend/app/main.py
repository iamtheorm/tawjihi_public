from typing import Annotated, List, Dict
from contextlib import asynccontextmanager
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models import models
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.analytics import router as analytics_router
from app.api.endpoints.customers import router as customers_router
from app.api.endpoints.customer_profile import router as customer_profile_router
from app.api.endpoints.recommendations import router as recommendations_router, segments_router, products_router
from app.db.database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

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
app.include_router(auth_router)
app.include_router(analytics_router)
app.include_router(customers_router)
app.include_router(customer_profile_router)
app.include_router(recommendations_router)
app.include_router(segments_router)
app.include_router(products_router)

@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {"message": "Welcome to Tawjih API"}