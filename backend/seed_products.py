from app.db.database import get_db
from app.models.models import Product, Segment
from sqlalchemy.orm import Session

def seed_products_and_segments():
    """Seed default products and segments for recommendations"""
    db = next(get_db())
    
    # Default products
    products = [
        {"name": "Personal Loan", "description": "Flexible personal loans for various needs"},
        {"name": "Credit Card", "description": "Premium credit cards with reward programs"},
        {"name": "Home Loan", "description": "Competitive home financing solutions"},
        {"name": "Car Loan", "description": "Vehicle financing with attractive rates"},
        {"name": "Investment Portfolio", "description": "Diversified investment solutions"},
        {"name": "Insurance Policy", "description": "Comprehensive life and health insurance"},
        {"name": "Savings Account", "description": "High-yield savings accounts"},
        {"name": "Current Account", "description": "Feature-rich current accounts for businesses"},
        {"name": "Fixed Deposit", "description": "Secure fixed deposit investments"},
        {"name": "Foreign Exchange", "description": "Foreign exchange and international services"}
    ]
    
    # Default segments
    segments = [
        {"name": "AI Generated"},
        {"name": "High Value"},
        {"name": "Young Professionals"},
        {"name": "Business Owners"},
        {"name": "Retirees"}
    ]
    
    # Add products
    for product_data in products:
        existing = db.query(Product).filter(Product.name == product_data["name"]).first()
        if not existing:
            product = Product(**product_data)
            db.add(product)
            print(f"Added product: {product_data['name']}")
    
    # Add segments
    for segment_data in segments:
        existing = db.query(Segment).filter(Segment.name == segment_data["name"]).first()
        if not existing:
            segment = Segment(**segment_data)
            db.add(segment)
            print(f"Added segment: {segment_data['name']}")
    
    db.commit()
    print("Product and segment seeding completed!")

if __name__ == "__main__":
    seed_products_and_segments()
