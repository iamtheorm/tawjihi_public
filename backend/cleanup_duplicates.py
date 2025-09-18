#!/usr/bin/env python3
"""
Script to clean up duplicate recommendations from the database.
This script removes duplicate CustomerRecommendation entries for the same customer and product,
keeping only the most recent recommendation.
"""

import sys
import os
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import CustomerRecommendation
from sqlalchemy import func

def cleanup_duplicate_recommendations():
    """Remove duplicate recommendations, keeping only the most recent one for each customer-product pair."""
    db: Session = next(get_db())

    try:
        # Find all customer-product pairs that have duplicates
        duplicates_query = db.query(
            CustomerRecommendation.customer_id,
            CustomerRecommendation.product_id,
            func.count(CustomerRecommendation.id).label('count')
        ).group_by(
            CustomerRecommendation.customer_id,
            CustomerRecommendation.product_id
        ).having(func.count(CustomerRecommendation.id) > 1).all()

        total_removed = 0

        for customer_id, product_id, count in duplicates_query:
            print(f"Found {count} duplicates for customer {customer_id}, product {product_id}")

            # Get all recommendations for this customer-product pair, ordered by creation time (newest first)
            recommendations = db.query(CustomerRecommendation).filter(
                CustomerRecommendation.customer_id == customer_id,
                CustomerRecommendation.product_id == product_id
            ).order_by(CustomerRecommendation.recommended_at.desc()).all()

            # Keep the first (most recent) recommendation, delete the rest
            if len(recommendations) > 1:
                to_delete = recommendations[1:]  # All except the first (most recent)
                for rec in to_delete:
                    db.delete(rec)
                    print(f"  Deleted recommendation ID {rec.id} (created: {rec.recommended_at})")

                total_removed += len(to_delete)

        db.commit()
        print(f"\nCleanup completed! Removed {total_removed} duplicate recommendations.")

        # Verify the cleanup
        remaining_duplicates = db.query(
            CustomerRecommendation.customer_id,
            CustomerRecommendation.product_id,
            func.count(CustomerRecommendation.id).label('count')
        ).group_by(
            CustomerRecommendation.customer_id,
            CustomerRecommendation.product_id
        ).having(func.count(CustomerRecommendation.id) > 1).count()

        if remaining_duplicates == 0:
            print("✅ No duplicates remain in the database.")
        else:
            print(f"⚠️  {remaining_duplicates} duplicate groups still exist.")

    except Exception as e:
        db.rollback()
        print(f"Error during cleanup: {str(e)}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting duplicate recommendations cleanup...")
    cleanup_duplicate_recommendations()
    print("Cleanup script finished.")
