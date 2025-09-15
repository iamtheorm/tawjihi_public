"""
Database migration script to update the customers table with new CSV fields
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import Settings
from app.db.database import Base, get_db
from app.models.models import Customer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_database():
    """
    Update the customers table with new CSV fields
    """
    try:
        settings = Settings()
        engine = create_engine(settings.DATABASE_URL)
        
        # Create all tables (this will add new columns to existing table)
        logger.info("Creating/updating database tables...")
        Base.metadata.create_all(bind=engine)
        
        logger.info("Database migration completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during database migration: {str(e)}")
        raise

if __name__ == "__main__":
    migrate_database()
