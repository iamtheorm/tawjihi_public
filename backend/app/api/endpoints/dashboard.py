from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Dict
from datetime import datetime, timedelta
from app.db.database import get_db
from app.models.models import (
    Customer, User, Transaction, Product, Segment,
    Recommendation, CustomerRecommendation, CustomerSegment,
    ProductPerformance, RegionalPerformance, MonthlyTrend,
    CustomerGrowth, TransactionType
)

router = APIRouter()

@router.get("/overview")
async def get_dashboard_overview(db: Session = Depends(get_db)):
    """Get overview statistics for the dashboard"""
    try:
        # Get total active customers
        active_customers = db.query(Customer).filter(Customer.status == "active").count()
        
        # Get conversion rate (from recommendations)
        total_recommendations = db.query(CustomerRecommendation).count()
        accepted_recommendations = db.query(CustomerRecommendation).filter(
            CustomerRecommendation.status == "accepted"
        ).count()
        conversion_rate = (accepted_recommendations / total_recommendations * 100) if total_recommendations > 0 else 0
        
        # Get revenue impact (from transactions)
        total_revenue = db.query(Transaction).filter(
            Transaction.transaction_type == TransactionType.CREDIT.value
        ).with_entities(func.sum(Transaction.amount)).scalar() or 0
        
        # Get customer growth
        last_month = datetime.utcnow() - timedelta(days=30)
        new_customers = db.query(Customer).filter(
            Customer.created_at >= last_month
        ).count()
        
        return {
            "active_customers": active_customers,
            "conversion_rate": round(conversion_rate, 2),
            "revenue_impact": round(total_revenue, 2),
            "new_customers": new_customers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/customer-activity")
async def get_customer_activity(db: Session = Depends(get_db)):
    """Get customer activity data for the chart"""
    try:
        # Get last 7 months of data
        months = []
        for i in range(7):
            month = datetime.utcnow() - timedelta(days=30*i)
            months.append(month.strftime("%b"))
        
        # Get active and dormant customers for each month
        activity_data = []
        for month in reversed(months):
            month_date = datetime.strptime(month, "%b")
            active = db.query(Customer).filter(
                Customer.status == "active",
                func.extract('month', Customer.updated_at) == month_date.month
            ).count()
            
            dormant = db.query(Customer).filter(
                Customer.status == "dormant",
                func.extract('month', Customer.updated_at) == month_date.month
            ).count()
            
            activity_data.append({
                "month": month,
                "active": active,
                "dormant": dormant
            })
        
        return activity_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversion-rates")
async def get_conversion_rates(db: Session = Depends(get_db)):
    """Get conversion rates data for the chart"""
    try:
        # Get last 7 months of data
        months = []
        for i in range(7):
            month = datetime.utcnow() - timedelta(days=30*i)
            months.append(month.strftime("%b"))
        
        # Calculate conversion rates for each month
        conversion_data = []
        for month in reversed(months):
            month_date = datetime.strptime(month, "%b")
            total = db.query(CustomerRecommendation).filter(
                func.extract('month', CustomerRecommendation.created_at) == month_date.month
            ).count()
            
            accepted = db.query(CustomerRecommendation).filter(
                func.extract('month', CustomerRecommendation.created_at) == month_date.month,
                CustomerRecommendation.status == "accepted"
            ).count()
            
            rate = (accepted / total * 100) if total > 0 else 0
            
            conversion_data.append({
                "month": month,
                "rate": round(rate, 2)
            })
        
        return conversion_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/top-recommendations")
async def get_top_recommendations(db: Session = Depends(get_db)):
    """Get top performing recommendations"""
    try:
        recommendations = db.query(
            Product.name.label("product"),
            Segment.name.label("segment"),
            func.count(CustomerRecommendation.id).label("total"),
            func.sum(case((CustomerRecommendation.status == "accepted", 1), else_=0)).label("accepted")
        ).join(
            CustomerRecommendation, Product.id == CustomerRecommendation.product_id
        ).join(
            Segment, Segment.id == CustomerRecommendation.segment_id
        ).group_by(
            Product.name, Segment.name
        ).order_by(
            func.count(CustomerRecommendation.id).desc()
        ).limit(4).all()
        
        return [
            {
                "id": idx + 1,
                "product": rec.product,
                "segment": rec.segment,
                "conversion": f"{round((rec.accepted / rec.total * 100) if rec.total > 0 else 0, 0)}%",
                "potential": "High" if (rec.accepted / rec.total) > 0.4 else "Medium"
            }
            for idx, rec in enumerate(recommendations)
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts")
async def get_alerts(db: Session = Depends(get_db)):
    """Get system alerts and opportunities"""
    try:
        # Get unusual spending patterns
        unusual_spending = db.query(User).join(Transaction).filter(
            Transaction.amount > 1000,  # Threshold for unusual spending
            Transaction.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        # Get dormant accounts
        dormant_accounts = db.query(Customer).filter(
            Customer.status == "dormant",
            Customer.updated_at >= datetime.utcnow() - timedelta(days=30)
        ).count()
        
        # Get potential insurance customers
        potential_insurance = db.query(User).filter(
            User.employment_status == "EMPLOYED",
            ~User.id.in_(
                db.query(CustomerRecommendation.customer_id).filter(
                    CustomerRecommendation.product_id == 1  # Assuming 1 is insurance product
                )
            )
        ).count()
        
        return [
            {
                "id": 1,
                "title": "High Spending Alert",
                "description": f"{unusual_spending} customers with unusual spending patterns detected",
                "type": "warning"
            },
            {
                "id": 2,
                "title": "Dormant Account Increase",
                "description": f"{dormant_accounts} new dormant accounts in the last 30 days",
                "type": "alert"
            },
            {
                "id": 3,
                "title": "New Opportunity",
                "description": f"{potential_insurance} customers eligible for Family Protection Insurance",
                "type": "opportunity"
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 