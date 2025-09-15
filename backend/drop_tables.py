from app.db.database import Base, engine
from app.models.models import (
    Customer, User, Transaction, Product, Segment,
    Recommendation, CustomerRecommendation, CustomerSegment,
    ProductPerformance, RegionalPerformance, MonthlyTrend,
    CustomerGrowth
)

def drop_tables():
    """Drop all database tables"""
    try:
        Base.metadata.drop_all(bind=engine)
        print("All tables dropped successfully!")
    except Exception as e:
        print(f"Error dropping tables: {str(e)}")

if __name__ == "__main__":
    drop_tables()