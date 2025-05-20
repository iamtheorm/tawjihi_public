from sqlalchemy.orm import Session
from app.models.models import Customer
from app.db.database import SessionLocal

def seed_customers():
    db = SessionLocal()
    try:
        # Check if customers already exist
        if db.query(Customer).first():
            print("Customers already exist in the database")
            return

        customers = [
            {
                "name": "Ahmed Al-Farsi",
                "email": "ahmed.f@example.com",
                "account": "3845792164",
                "segment": "High Net Worth",
                "status": "active",
                "recommendation": "Premium Sharia-Compliant Card",
                "potential": "high"
            },
            {
                "name": "Fatima Al-Balushi",
                "email": "fatima.b@example.com",
                "account": "9273518462",
                "segment": "Mass Affluent",
                "status": "active",
                "recommendation": "Sukuk Investment Portfolio",
                "potential": "medium"
            },
            {
                "name": "Khalid Al-Habsi",
                "email": "khalid.h@example.com",
                "account": "1629384750",
                "segment": "Retail",
                "status": "inactive",
                "recommendation": "Savings Account",
                "potential": "low"
            },
            {
                "name": "Aisha Al-Zadjali",
                "email": "aisha.z@example.com",
                "account": "5647382910",
                "segment": "Small Business",
                "status": "active",
                "recommendation": "Business Finance Line",
                "potential": "high"
            },
            {
                "name": "Mohammed Al-Kindi",
                "email": "mohammed.k@example.com",
                "account": "7891234560",
                "segment": "High Net Worth",
                "status": "active",
                "recommendation": "Wealth Management",
                "potential": "high"
            },
            {
                "name": "Laila Al-Rawahi",
                "email": "laila.r@example.com",
                "account": "4567891230",
                "segment": "Mass Affluent",
                "status": "dormant",
                "recommendation": "Retirement Plan",
                "potential": "medium"
            }
        ]

        for customer_data in customers:
            customer = Customer(**customer_data)
            db.add(customer)
        
        db.commit()
        print("Successfully seeded customers data")
    except Exception as e:
        print(f"Error seeding customers: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_customers() 