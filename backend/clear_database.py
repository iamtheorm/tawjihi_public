#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text
from app.db.database import Base
from app.models.models import Customer, User, Transaction, CustomerRecommendation
from app.core.config import settings

# Use the same database URL as the app
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def clear_database():
    """Clear all data from the database"""
    with SessionLocal() as session:
        try:
            # Delete all records in reverse order of dependencies
            # First, delete tables that reference others
            session.execute(text("DELETE FROM auth"))
            session.query(CustomerRecommendation).delete()
            session.query(Transaction).delete()
            session.query(User).delete()
            session.query(Customer).delete()

            session.commit()
            print("Database cleared successfully!")
        except Exception as e:
            session.rollback()
            print(f"Error clearing database: {e}")
            raise

if __name__ == "__main__":
    clear_database()
