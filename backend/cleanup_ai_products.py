#!/usr/bin/env python3
"""
Script to remove AI-recommended products from the database
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models import models

def cleanup_ai_products():
    """Remove products that were created by AI recommendations"""
    db = SessionLocal()
    try:
        # Find and delete products with names starting with "AI recommended"
        ai_products = db.query(models.Product).filter(
            models.Product.name.like("AI recommended%")
        ).all()

        if ai_products:
            print(f"Found {len(ai_products)} AI-recommended products to delete:")
            for product in ai_products:
                print(f"  - {product.name} (ID: {product.id})")

            # Delete the products
            for product in ai_products:
                db.delete(product)

            db.commit()
            print(f"Successfully deleted {len(ai_products)} AI-recommended products")
        else:
            print("No AI-recommended products found in database")

    except Exception as e:
        print(f"Error cleaning up products: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_ai_products()
