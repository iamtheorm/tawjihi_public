from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import customers
from . import models
from .database import engine

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Setup CORS
origins = [
    "http://localhost:3000",  # Next.js frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    # allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your customers router
app.include_router(customers.router)
