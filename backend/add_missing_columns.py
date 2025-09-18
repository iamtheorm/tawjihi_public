from sqlalchemy import text
from app.db.database import engine

def add_missing_columns():
    """Add missing created_at and updated_at columns to all analytics tables"""

    tables_to_update = [
        'product_performance',
        'regional_performance',
        'monthly_trends',
        'customer_growth',
        'customer_segments',
        'transactions'
    ]

    with engine.connect() as conn:
        try:
            # Create trigger function for updated_at if it doesn't exist
            conn.execute(text("""
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = NOW();
                    RETURN NEW;
                END;
                $$ language 'plpgsql';
            """))
            print("Created update_updated_at_column function")

            for table_name in tables_to_update:
                try:
                    # Add created_at column if it doesn't exist
                    conn.execute(text(f"""
                        ALTER TABLE {table_name}
                        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    """))
                    print(f"Added created_at column to {table_name} table")

                    # Add updated_at column if it doesn't exist
                    conn.execute(text(f"""
                        ALTER TABLE {table_name}
                        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE
                    """))
                    print(f"Added updated_at column to {table_name} table")

                    # Create trigger for updated_at
                    conn.execute(text(f"""
                        DROP TRIGGER IF EXISTS update_{table_name}_updated_at ON {table_name};
                        CREATE TRIGGER update_{table_name}_updated_at
                            BEFORE UPDATE ON {table_name}
                            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
                    """))
                    print(f"Created trigger for {table_name} updated_at column")

                except Exception as table_error:
                    print(f"Error updating table {table_name}: {table_error}")
                    continue

            conn.commit()
            print("Successfully added missing columns to all analytics tables")

        except Exception as e:
            print(f"Error adding columns: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_missing_columns()
