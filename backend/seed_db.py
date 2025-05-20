from app.db.seed_customers import seed_customers
from app.db.database import init_db

def main():
    print("Initializing database...")
    init_db()
    print("Starting database seeding...")
    seed_customers()
    print("Database seeding completed!")

if __name__ == "__main__":
    main() 