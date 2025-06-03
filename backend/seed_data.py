from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.models.models import (
    Customer, User, Transaction, Product, Segment,
    Recommendation, CustomerRecommendation, CustomerSegment,
    ProductPerformance, RegionalPerformance, MonthlyTrend,
    CustomerGrowth, EmploymentStatus, MaritalStatus, TransactionType
)
from app.db.database import Base

# Create all tables
Base.metadata.create_all(bind=engine)

# Sample data
SEGMENTS = [
    "High Net Worth",
    "Mass Affluent",
    "Young Professionals",
    "Small Business",
    "Homeowners",
    "Retirees",
    "Students"
]

PRODUCTS = [
    {
        "name": "Al Jawhar Credit Card",
        "description": "Premium credit card with exclusive benefits and rewards"
    },
    {
        "name": "Home Loan",
        "description": "Competitive home financing solutions"
    },
    {
        "name": "Mutual Funds - Fund 1",
        "description": "Balanced investment portfolio for long-term growth"
    },
    {
        "name": "Personal Loan",
        "description": "Flexible personal financing options"
    },
    {
        "name": "Family Protection Insurance",
        "description": "Comprehensive family insurance coverage"
    },
    {
        "name": "Savings Account Plus",
        "description": "High-yield savings account with premium features"
    },
    {
        "name": "Business Credit Line",
        "description": "Flexible credit solutions for businesses"
    },
    {
        "name": "Investment Portfolio",
        "description": "Diversified investment options"
    }
]

CITIES = [
    "Muscat",
    "Salalah",
    "Sohar",
    "Nizwa",
    "Sur",
    "Rustaq"
]

INDUSTRIES = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Manufacturing",
    "Retail",
    "Construction",
    "Hospitality"
]

OCCUPATIONS = [
    "Software Engineer",
    "Doctor",
    "Teacher",
    "Banker",
    "Manager",
    "Architect",
    "Business Owner",
    "Student"
]

# Keep track of used emails to ensure uniqueness
used_emails = set()

def generate_customer_data():
    """Generate realistic customer data with unique email"""
    first_names = ["Ahmed", "Mohammed", "Fatima", "Aisha", "Omar", "Khalid", "Layla", "Noor"]
    last_names = ["Al-Mazroui", "Al-Hashemi", "Al-Saadi", "Al-Balushi", "Al-Nabhani", "Al-Riyami"]
    
    # Generate unique email
    while True:
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@example.com"
        if email not in used_emails:
            used_emails.add(email)
            break
    
    # Generate creation date between 2021 and now
    created_at = datetime(2021, 1, 1) + timedelta(days=random.randint(0, (datetime.now() - datetime(2021, 1, 1)).days))
    
    return {
        "name": f"{first_name} {last_name}",
        "email": email,
        "account": f"ACC{random.randint(100000, 999999)}",
        "segment": random.choice(SEGMENTS),
        "status": random.choice(["active", "dormant"]),
        "recommendation": random.choice(["High", "Medium", "Low"]),
        "potential": random.choice(["High", "Medium", "Low"]),
        "created_at": created_at,
        "updated_at": created_at + timedelta(days=random.randint(0, 30))
    }

def generate_user_data():
    """Generate realistic user data"""
    return {
        "account_number": f"ACC{random.randint(100000, 999999)}",
        "industry": random.choice(INDUSTRIES),
        "occupation": random.choice(OCCUPATIONS),
        "organisation": f"{random.choice(INDUSTRIES)} Company {random.randint(1, 100)}",
        "residence": random.choice(CITIES),
        "date_of_birth": (datetime.now() - timedelta(days=random.randint(365*18, 365*65))).strftime("%Y-%m-%d"),
        "employment_status": random.choice(list(EmploymentStatus)),
        "basic_salary": random.randint(500, 5000),
        "expected_monthly_income": random.randint(1000, 10000),
        "permanent_address_line1": f"Building {random.randint(1, 100)}, Street {random.randint(1, 50)}",
        "city": random.choice(CITIES),
        "post_code": f"{random.randint(100, 999)}",
        "nationality": "Omani",
        "marital_status": random.choice(list(MaritalStatus))
    }

def generate_transaction_data(account_number, start_date):
    """Generate realistic transaction data with historical dates"""
    transaction_types = ["CREDIT", "DEBIT"]
    descriptions = [
        "Salary Deposit",
        "ATM Withdrawal",
        "Online Purchase",
        "Bill Payment",
        "Transfer",
        "Interest Credit",
        "Utility Payment",
        "Shopping",
        "Restaurant",
        "Travel"
    ]
    
    # Generate transactions for the last 12 months
    transactions = []
    current_date = datetime.now()
    while current_date >= start_date:
        # Generate 2-5 transactions per month
        for _ in range(random.randint(2, 5)):
            transaction_date = current_date - timedelta(days=random.randint(0, 30))
            if transaction_date >= start_date:
                transactions.append({
                    "account_number": account_number,
                    "transaction_type": random.choice(transaction_types),
                    "amount": random.randint(10, 5000),
                    "description": random.choice(descriptions),
                    "created_at": transaction_date
                })
        current_date -= timedelta(days=30)
    
    return transactions

def generate_recommendation_data(customer_id, product_id, segment_id, created_at):
    """Generate realistic recommendation data"""
    statuses = ["pending", "accepted", "rejected"]
    reasons = [
        "Based on customer's spending pattern",
        "Based on income level",
        "Based on life stage",
        "Based on transaction history",
        "Based on customer segment",
        "Based on product affinity"
    ]
    
    # Generate a more realistic recommendation reason based on product type
    db = SessionLocal()
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        if "Credit Card" in product.name:
            reason = "Based on your spending patterns and credit history"
        elif "Loan" in product.name:
            reason = "Based on your income level and financial needs"
        elif "Insurance" in product.name:
            reason = "Based on your life stage and protection needs"
        elif "Investment" in product.name or "Fund" in product.name:
            reason = "Based on your investment potential and risk profile"
        else:
            reason = random.choice(reasons)
    else:
        reason = random.choice(reasons)
    
    return {
        "customer_id": customer_id,
        "product_id": product_id,
        "segment_id": segment_id,
        "recommendation_reason": reason,
        "status": random.choice(statuses),
        "created_at": created_at
    }

def seed_database():
    """Seed the database with realistic data"""
    db = SessionLocal()
    try:
        # Create segments
        segments = []
        for segment_name in SEGMENTS:
            segment = Segment(name=segment_name)
            db.add(segment)
            segments.append(segment)
        db.commit()

        # Create products
        products = []
        for product_data in PRODUCTS:
            product = Product(**product_data)
            db.add(product)
            products.append(product)
        db.commit()

        # Create customers and users with historical data
        for _ in range(200):  # Create 200 customers
            # Create customer
            customer_data = generate_customer_data()
            customer = Customer(**customer_data)
            db.add(customer)
            db.commit()

            # Create user
            user_data = generate_user_data()
            user = User(**user_data)
            db.add(user)
            db.commit()

            # Create transactions for the last 12 months
            transactions = generate_transaction_data(user.account_number, customer.created_at)
            for transaction_data in transactions:
                transaction = Transaction(**transaction_data)
                db.add(transaction)
            db.commit()

            # Create recommendations (2-4 per customer)
            for _ in range(random.randint(2, 4)):
                # Select a product based on customer segment
                if customer.segment == "High Net Worth":
                    product = random.choice([p for p in products if "Credit Card" in p.name or "Investment" in p.name])
                elif customer.segment == "Mass Affluent":
                    product = random.choice([p for p in products if "Savings" in p.name or "Mutual" in p.name])
                elif customer.segment == "Small Business":
                    product = random.choice([p for p in products if "Business" in p.name or "Loan" in p.name])
                else:
                    product = random.choice(products)
                
                recommendation_data = generate_recommendation_data(
                    customer.id,
                    product.id,
                    random.choice(segments).id,
                    customer.created_at + timedelta(days=random.randint(0, 30))
                )
                recommendation = CustomerRecommendation(**recommendation_data)
                db.add(recommendation)
            db.commit()

        # Create analytics data for multiple years
        years = [2021, 2022, 2023]
        for year in years:
            # Customer segments
            for segment in segments:
                customer_segment = CustomerSegment(
                    name=segment.name,
                    value=random.randint(50, 500)
                )
                db.add(customer_segment)

            # Product performance - ensure each product has data for each quarter
            for product in products:
                for quarter in range(1, 5):
                    product_performance = ProductPerformance(
                        name=product.name,
                        current=random.randint(1000, 10000),
                        previous=random.randint(1000, 10000),
                        period=f"{year}-Q{quarter}"
                    )
                    db.add(product_performance)

            # Regional performance
            for city in CITIES:
                regional_performance = RegionalPerformance(
                    region=city,
                    customers=random.randint(100, 1000),
                    revenue=random.randint(10000, 100000),
                    growth=random.uniform(0.1, 0.5),
                    period=f"{year}-Q{random.randint(1, 4)}"
                )
                db.add(regional_performance)

            # Monthly trends
            for month in range(1, 13):
                monthly_trend = MonthlyTrend(
                    month=datetime(year, month, 1).strftime("%b"),
                    year=year,
                    deposits=random.randint(100000, 1000000),
                    withdrawals=random.randint(50000, 500000),
                    net_flow=random.randint(-100000, 500000)
                )
                db.add(monthly_trend)

            # Customer growth
            for month in range(1, 13):
                customer_growth = CustomerGrowth(
                    month=datetime(year, month, 1).strftime("%b"),
                    year=year,
                    new_customers=random.randint(50, 200),
                    churned_customers=random.randint(10, 50),
                    net_growth=random.randint(20, 150)
                )
                db.add(customer_growth)

        # Populate the Recommendation table
        for product in products:
            for segment in segments:
                recommendation = Recommendation(
                    product_id=product.id,
                    segment_id=segment.id,
                    potential=random.choice(["High", "Medium", "Low"])
                )
                db.add(recommendation)
        db.commit()

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 