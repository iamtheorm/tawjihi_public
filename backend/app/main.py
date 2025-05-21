from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import customers, recommendations  # ⬅️ Import the new router
from . import models
from .database import engine, SessionLocal
from .models import Product, Segment

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Setup CORS
origins = [
    "http://localhost:3000",  # Next.js frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(customers.router)
app.include_router(recommendations.router)  # ⬅️ Add this line

# Seed data on startup
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    if not db.query(Segment).first():
        segments = [
            Segment(name="High Net Worth"),
            Segment(name="Mass Affluent"),
            Segment(name="Young Professionals"),
            Segment(name="Small Business")
        ]
        db.add_all(segments)
    
    if not db.query(Product).first():
        products = [
            Product(name="Premium Credit Card", description="High-end credit card."),
            Product(name="Investment Portfolio", description="Custom investment options."),
            Product(name="Home Loan Refinance", description="Reduce your loan interest."),
            Product(name="Savings Account", description="Basic savings account.")
        ]
        db.add_all(products)

    db.commit()
    db.close()
