from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Customer, User, Transaction, Product, Segment, Recommendation, CustomerRecommendation

def seed_database():
    db = SessionLocal()
    try:
        # Create segments
        segments = [
            Segment(name="High Value"),
            Segment(name="Medium Value"),
            Segment(name="Low Value"),
            Segment(name="New Customer")
        ]
        db.add_all(segments)
        db.commit()

        # Create products
        products = [
            Product(name="Savings Account", description="Basic savings account with interest"),
            Product(name="Investment Fund", description="Long-term investment opportunity"),
            Product(name="Credit Card", description="Premium credit card with rewards"),
            Product(name="Mortgage", description="Home loan with competitive rates")
        ]
        db.add_all(products)
        db.commit()

        # Create customers
        customers = [
            Customer(
                name="John Doe",
                email="john@example.com",
                account="ACC001",
                segment="High Value",
                status="Active",
                recommendation="Investment Fund",
                potential="High",
                created_at=datetime.utcnow() - timedelta(days=30)
            ),
            Customer(
                name="Jane Smith",
                email="jane@example.com",
                account="ACC002",
                segment="Medium Value",
                status="Active",
                recommendation="Savings Account",
                potential="Medium",
                created_at=datetime.utcnow() - timedelta(days=15)
            ),
            Customer(
                name="Bob Johnson",
                email="bob@example.com",
                account="ACC003",
                segment="Low Value",
                status="Inactive",
                recommendation="Credit Card",
                potential="Low",
                created_at=datetime.utcnow() - timedelta(days=5)
            )
        ]
        db.add_all(customers)
        db.commit()

        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 