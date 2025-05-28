from sqlalchemy import text
from app.db.database import engine, Base
from app.models.models import Customer, User, Transaction, Product, Segment, Recommendation, CustomerRecommendation

def reset_database():
    # Drop all tables
    Base.metadata.drop_all(bind=engine)
    print("Dropped all tables")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Created all tables")

if __name__ == "__main__":
    reset_database() 