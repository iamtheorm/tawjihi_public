from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.models.models import Customer, Transaction, User
from app.schemas.schemas import CustomerProfile

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
    
    # Get transaction history
    transactions = db.query(Transaction).filter(
        Transaction.account_number == customer.account
    ).order_by(Transaction.transaction_date.desc()).limit(10).all()
    
    # Generate personalized recommendations based on customer data
    recommendations = generate_recommendations(customer, user, transactions)
    
    return {
        "customer": customer,
        "user": user,
        "transactions": transactions or [],
        "recommendations": recommendations
    }

def generate_recommendations(customer: Customer, user: User, transactions: List[Transaction]) -> List[Dict[str, Any]]:
    recommendations = []
    
    # Analyze transaction patterns
    total_credit = sum(t.amount for t in transactions if t.transaction_type == "CREDIT")
    total_debit = sum(t.amount for t in transactions if t.transaction_type == "DEBIT")
    avg_transaction = (total_credit + total_debit) / len(transactions) if transactions else 0
    
    # Basic recommendations based on customer segment
    if customer.segment == "High Net Worth":
        recommendations.extend([
            {
                "title": "Premium Investment Portfolio",
                "description": "Based on your high net worth status, consider our premium investment portfolio with exclusive benefits.",
                "priority": "high"
            },
            {
                "title": "Private Banking Services",
                "description": "Access to dedicated relationship manager and premium banking services.",
                "priority": "high"
            }
        ])
    elif customer.segment == "Mass Affluent":
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
    if user and user.employment_status == "self_employed":
        recommendations.append({
            "title": "Business Loan Options",
            "description": "Explore our competitive business loan options for self-employed professionals.",
            "priority": "medium"
        })
    
    return recommendations 