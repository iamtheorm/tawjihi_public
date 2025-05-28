from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from datetime import datetime, UTC
# from dotenv import load_dotenv
from app.models.models import (
    Segment, Product, Recommendation, CustomerRecommendation,
    CustomerSegment, ProductPerformance, RegionalPerformance,
    MonthlyTrend, CustomerGrowth, User, Transaction, TransactionType,
    Customer, EmploymentStatus, MaritalStatus, Auth
)
from passlib.context import CryptContext

# Load environment variables
# load_dotenv()

# Database setup
# DB_HOST = os.getenv("DB_HOST", "localhost")
# DB_NAME = os.getenv("DB_NAME", "tawjihai_test")
# DB_USER = os.getenv("DB_USER", "postgres")
# DB_PASSWORD = os.getenv("DB_PASSWORD", "ritesh123")
# DB_PORT = os.getenv("DB_PORT", "5432")

DATABASE_URL = "postgresql://postgres:ritesh123@localhost:5432/tawjihai_test"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_recommendations_data(db):
    """Seeds recommendations data including segments, products, and recommendations."""
    try:
        print("\n=== Seeding Recommendations Data ===")
        
        # Check if data already exists
        if not db.query(Segment).first():
            print("Creating segments...")
            segments = [
                Segment(name="High Net Worth"),
                Segment(name="Mass Affluent"),
                Segment(name="Young Professionals"),
                Segment(name="Small Business")
            ]
            db.add_all(segments)
            db.commit()
            print(f"✅ Segments seeded successfully: {len(segments)} segments created")
        else:
            print("Segments already exist")
        
        if not db.query(Product).first():
            print("Creating products...")
            products = [
                Product(name="Premium Credit Card", description="High-end credit card with exclusive benefits."),
                Product(name="Investment Portfolio", description="Custom investment options for wealth growth."),
                Product(name="Home Loan Refinance", description="Reduce your loan interest and monthly payments."),
                Product(name="Savings Account", description="High-yield savings account with competitive rates.")
            ]
            db.add_all(products)
            db.commit()
            print(f"✅ Products seeded successfully: {len(products)} products created")
        else:
            print("Products already exist")

        if not db.query(Recommendation).first():
            print("Creating recommendations...")
            segments = db.query(Segment).all()
            products = db.query(Product).all()
            print(f"Found {len(segments)} segments and {len(products)} products")

            recommendations = []
            for product in products:
                for segment in segments:
                    potential = "high"
                    if segment.name == "Young Professionals" and product.name == "Home Loan Refinance":
                        potential = "medium"
                    elif segment.name == "Small Business" and product.name == "Savings Account":
                        potential = "low"

                    recommendations.append(
                        Recommendation(
                            product_id=product.id,
                            segment_id=segment.id,
                            potential=potential
                        )
                    )

            db.add_all(recommendations)
            db.commit()
            print(f"✅ Recommendations seeded successfully: {len(recommendations)} recommendations created")
        else:
            print("Recommendations already exist")
            
    except Exception as e:
        print(f"❌ Error seeding recommendations data: {str(e)}")
        db.rollback()
        raise

def seed_analytics_data(db):
    """Seeds analytics data including customer segments, product performance, and trends."""
    try:
        print("\n=== Seeding Analytics Data ===")
        
        # Seed Customer Segments
        if not db.query(CustomerSegment).first():
            segments = [
                CustomerSegment(name="High Net Worth", value=35),
                CustomerSegment(name="Mass Affluent", value=25),
                CustomerSegment(name="Retail", value=30),
                CustomerSegment(name="Small Business", value=10),
            ]
            db.add_all(segments)
            print("✅ Customer segments seeded successfully")

        # Seed Product Performance
        if not db.query(ProductPerformance).first():
            periods = ["2021-Q4", "2022-Q1", "2022-Q2", "2022-Q3", "2022-Q4", "2023-Q1", "2023-Q2"]
            products = []
            for period in periods:
                base_value = 500 if "2021" in period else (600 if "2022" in period else 700)
                products.extend([
                    ProductPerformance(name="Savings Accounts", current=base_value + 150, previous=base_value + 100, period=period),
                    ProductPerformance(name="Current Accounts", current=base_value + 100, previous=base_value + 50, period=period),
                    ProductPerformance(name="Home Finance", current=base_value + 50, previous=base_value + 20, period=period),
                    ProductPerformance(name="Personal Finance", current=base_value + 30, previous=base_value + 10, period=period),
                    ProductPerformance(name="Credit Cards", current=base_value + 80, previous=base_value + 40, period=period),
                    ProductPerformance(name="Investment Products", current=base_value + 40, previous=base_value + 20, period=period),
                ])
            db.add_all(products)
            print("✅ Product performance data seeded successfully")

        # Seed Regional Performance
        if not db.query(RegionalPerformance).first():
            periods = ["2021-Q4", "2022-Q1", "2022-Q2", "2022-Q3", "2022-Q4", "2023-Q1", "2023-Q2"]
            regions = []
            for period in periods:
                regions.extend([
                    RegionalPerformance(region="Muscat", customers=2500, revenue=1200000, growth=15, period=period),
                    RegionalPerformance(region="Salalah", customers=1200, revenue=600000, growth=12, period=period),
                    RegionalPerformance(region="Sohar", customers=950, revenue=450000, growth=8, period=period),
                    RegionalPerformance(region="Nizwa", customers=780, revenue=350000, growth=10, period=period),
                    RegionalPerformance(region="Sur", customers=650, revenue=280000, growth=7, period=period),
                ])
            db.add_all(regions)
            print("✅ Regional performance data seeded successfully")

        # Seed Monthly Trends
        if not db.query(MonthlyTrend).first():
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            monthly_trends = []
            for year in [2021, 2022, 2023]:
                base_value = 1000000 if year == 2021 else (1200000 if year == 2022 else 1500000)
                for i, month in enumerate(months):
                    deposits = base_value + (i * 100000)
                    withdrawals = (base_value * 0.7) + (i * 50000)
                    net_flow = deposits - withdrawals
                    monthly_trends.append(
                        MonthlyTrend(
                            month=month,
                            year=year,
                            deposits=deposits,
                            withdrawals=withdrawals,
                            net_flow=net_flow
                        )
                    )
            db.add_all(monthly_trends)
            print("✅ Monthly trends data seeded successfully")

        # Seed Customer Growth
        if not db.query(CustomerGrowth).first():
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            customer_growth = []
            for year in [2021, 2022, 2023]:
                base_value = 50 if year == 2021 else (75 if year == 2022 else 100)
                for i, month in enumerate(months):
                    new_customers = base_value + (i * 20)
                    churned_customers = (base_value * 0.2) + (i * 5)
                    net_growth = new_customers - churned_customers
                    customer_growth.append(
                        CustomerGrowth(
                            month=month,
                            year=year,
                            new_customers=new_customers,
                            churned_customers=churned_customers,
                            net_growth=net_growth
                        )
                    )
            db.add_all(customer_growth)
            print("✅ Customer growth data seeded successfully")

        db.commit()
            
    except Exception as e:
        print(f"❌ Error seeding analytics data: {str(e)}")
        db.rollback()
        raise

def seed_customers_data(db):
    """Seed customers data"""
    try:
        # Create users
        users = []
        for i in range(1, 101):
            user = User(
                account_number=f"ACC{i:06d}",
                industry="Technology",
                occupation="Software Engineer",
                organisation="Tech Corp",
                residence="Muscat",
                date_of_birth="1990-01-01",
                employment_status=EmploymentStatus.EMPLOYED,
                basic_salary=2000.0,
                expected_monthly_income=2500.0,
                permanent_address_line1="123 Main St",
                city="Muscat",
                post_code="123",
                nationality="Omani",
                marital_status=MaritalStatus.SINGLE
            )
            users.append(user)
        
        db.bulk_save_objects(users)
        db.commit()
        print("✅ Users seeded successfully")

        # Create transactions
        transactions = []
        for user in users:
            for j in range(5):  # 5 transactions per user
                transaction = Transaction(
                    account_number=user.account_number,
                    transaction_type=TransactionType.CREDIT if j % 2 == 0 else TransactionType.DEBIT,
                    amount=1000.0 if j % 2 == 0 else -500.0,
                    description=f"Transaction {j+1} for {user.account_number}",
                    created_at=datetime.now(UTC)
                )
                transactions.append(transaction)
        
        db.bulk_save_objects(transactions)
        db.commit()
        print("✅ Transactions seeded successfully")

        # Create sample customers
        customers = []
        for i in range(1, 101):
            customer = Customer(
                name=f"Customer {i}",
                email=f"customer{i}@example.com",
                account=f"ACC{i:06d}",
                segment="Premium" if i % 3 == 0 else "Standard",
                status="Active",
                recommendation="Investment Portfolio" if i % 3 == 0 else "Savings Account",
                potential="High" if i % 3 == 0 else "Medium"
            )
            customers.append(customer)
        
        db.bulk_save_objects(customers)
        db.commit()
        print("✅ Sample customers seeded successfully")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding customers data: {str(e)}")
        raise

def seed_auth_data(db):
    """Seed authentication data"""
    try:
        # Create admin user
        admin = Auth(
            email="admin@example.com",
            password=get_password_hash("admin123"),
            is_active=True,
            is_superuser=True
        )
        
        # Create regular user
        user = Auth(
            email="user@example.com",
            password=get_password_hash("user123"),
            is_active=True,
            is_superuser=False
        )
        
        db.add_all([admin, user])
        db.commit()
        print("✅ Auth users seeded successfully")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding auth data: {str(e)}")
        raise

def seed_all_data():
    """Main function to seed all data."""
    db = SessionLocal()
    try:
        print("Starting database seeding process...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        # Seed all data
        seed_auth_data(db)
        seed_recommendations_data(db)
        seed_analytics_data(db)
        seed_customers_data(db)
        
        print("\n✅ All data seeded successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during seeding process: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_data() 