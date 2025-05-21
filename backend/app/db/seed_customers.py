from sqlalchemy.orm import Session
from app.models.models import Customer
from app.db.database import SessionLocal

def seed_customers():
    db = SessionLocal()
    try:
        # Check if we already have customers
        if db.query(Customer).first():
            print("Customers already exist in the database")
            return

        # Sample customers
        customers = [
            Customer(
                name="John Doe",
                email="john.doe@example.com",
                account="ACC001",
                segment="High Net Worth",
                status="active",
                potential="high",
                recommendation="Premium Investment Portfolio"
            ),
            Customer(
                name="Jane Smith",
                email="jane.smith@example.com",
                account="ACC002",
                segment="Mass Affluent",
                status="active",
                potential="medium",
                recommendation="Investment Advisory"
            ),
            Customer(
                name="Bob Johnson",
                email="bob.johnson@example.com",
                account="ACC003",
                segment="Retail",
                status="active",
                potential="low",
                recommendation="Basic Savings Account"
            )
        ]

        # Add customers to database
        for customer in customers:
            db.add(customer)
        
        db.commit()
        print("Successfully seeded customers")
    except Exception as e:
        print(f"Error seeding customers: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_customers() 