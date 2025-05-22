# seed.py
from app.database import SessionLocal
from app.models import Segment, Product

db = SessionLocal()

# Seed segments
segments = [
    Segment(name="High Net Worth"),
    Segment(name="Mass Affluent"),
    Segment(name="Young Professionals"),
    Segment(name="Small Business")
]
for seg in segments:
    db.add(seg)

# Seed products
products = [
    Product(name="Premium Credit Card", description="High-end credit card."),
    Product(name="Investment Portfolio", description="Custom investment options."),
    Product(name="Home Loan Refinance", description="Reduce your loan interest."),
    Product(name="Savings Account", description="Basic savings account.")
]
for prod in products:
    db.add(prod)

db.commit()
db.close()

print("✅ Database seeded with segments and products.")
