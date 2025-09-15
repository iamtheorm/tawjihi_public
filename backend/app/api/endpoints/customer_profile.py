from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.models.models import Customer, Transaction, User, CustomerRecommendation, Product, Segment
from app.schemas.schemas import CustomerProfile, UserResponse, Transaction as TransactionSchema

router = APIRouter(
    prefix="/customer-profile",
    tags=["customer-profile"]
)

@router.get("/{customer_id}", response_model=CustomerProfile)
async def get_customer_profile(customer_id: int, db: Session = Depends(get_db)):
    # Get customer details
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Get user details if exists
    user = db.query(User).filter(User.account_number == customer.account).first()
    user_response = UserResponse.from_orm(user) if user else None
    
    # Get transaction history
    transactions = db.query(Transaction).filter(
        Transaction.account_number == customer.account
    ).order_by(Transaction.created_at.desc()).limit(10).all()
    
    # Convert transactions to schema
    transaction_schemas = [TransactionSchema.from_orm(t) for t in transactions]
      # Fetch recommendations from CustomerRecommendation table (including AI-generated ones)
    recommendations = db.query(CustomerRecommendation).filter(
        CustomerRecommendation.customer_id == customer_id
    ).order_by(CustomerRecommendation.priority, CustomerRecommendation.confidence_score.desc()).all()
    
    # Convert recommendations to the expected format
    recommendation_list = []
    for rec in recommendations:
        product = db.query(Product).filter(Product.id == rec.product_id).first()
        segment = db.query(Segment).filter(Segment.id == rec.segment_id).first()
        if product and segment:
            # Determine priority based on confidence score and status
            if rec.confidence_score and rec.confidence_score >= 0.8:
                priority = "high"
            elif rec.confidence_score and rec.confidence_score >= 0.6:
                priority = "medium"
            else:
                priority = "low"
                
            recommendation_list.append({
                "title": product.name,
                "description": rec.recommendation_reason or product.description,
                "priority": priority,
                "confidence": rec.confidence_score,
                "status": rec.status,
                "segment": segment.name,
                "recommended_at": rec.recommended_at
            })
    
    return {
        "customer": customer,
        "user": user_response,
        "transactions": transaction_schemas,
        "recommendations": recommendation_list
    }

def generate_recommendations(customer: Customer, user: User, transactions: List[Transaction]) -> List[Dict[str, Any]]:
    recommendations = []
    
    # Analyze transaction patterns
    total_credit = sum(t.amount for t in transactions if t.transaction_type == "CREDIT")
    total_debit = sum(t.amount for t in transactions if t.transaction_type == "DEBIT")
    avg_transaction = (total_credit + total_debit) / len(transactions) if transactions else 0
    
    # Basic recommendations based on customer segment
    if customer.segment == "High Value":
        recommendations.extend([
            {
                "title": "Premium Investment Portfolio",
                "description": "Based on your high value status, consider our premium investment portfolio with exclusive benefits.",
                "priority": "high"
            },
            {
                "title": "Private Banking Services",
                "description": "Access to dedicated relationship manager and premium banking services.",
                "priority": "high"
            }
        ])
    elif customer.segment == "Medium Value":
        recommendations.extend([
            {
                "title": "Investment Advisory",
                "description": "Get personalized investment advice to grow your wealth.",
                "priority": "medium"
            },
            {
                "title": "Premium Credit Card",
                "description": "Upgrade to our premium credit card with enhanced rewards and benefits.",
                "priority": "medium"
            }
        ])
    
    # Recommendations based on transaction patterns
    if avg_transaction > 10000:
        recommendations.append({
            "title": "Business Banking Solutions",
            "description": "Based on your transaction patterns, our business banking solutions could benefit you.",
            "priority": "high"
        })
    
    if total_credit > total_debit * 2:
        recommendations.append({
            "title": "Savings Account Upgrade",
            "description": "Consider upgrading to a high-yield savings account to maximize your savings.",
            "priority": "medium"
        })
    
    # Recommendations based on user profile
    if user and user.employment_status == "SELF_EMPLOYED":
        recommendations.append({
            "title": "Business Loan Options",
            "description": "Explore our competitive business loan options for self-employed professionals.",
            "priority": "medium"
        })
    
    return recommendations 