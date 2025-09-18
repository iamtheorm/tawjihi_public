from sqlalchemy import create_engine, MetaData, Table, text
from app.core.config import settings

def add_missing_columns():
    # Create engine
    engine = create_engine(settings.DATABASE_URL)

    # Create metadata
    metadata = MetaData()

    # Reflect the existing products table
    products_table = Table('products', metadata, autoload_with=engine)

    # Check if category column already exists in products
    if 'category' not in products_table.columns:
        # Add the category column
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE products ADD COLUMN category VARCHAR(255)"))
            conn.commit()
        print("Category column added to products table successfully!")
    else:
        print("Category column already exists in products table.")

    # Reflect the existing segments table
    segments_table = Table('segments', metadata, autoload_with=engine)

    # Check if description column already exists in segments
    if 'description' not in segments_table.columns:
        # Add the description column
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE segments ADD COLUMN description VARCHAR(255)"))
            conn.commit()
        print("Description column added to segments table successfully!")
    else:
        print("Description column already exists in segments table.")

if __name__ == "__main__":
    add_missing_columns()
