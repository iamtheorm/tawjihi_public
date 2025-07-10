from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, UTC
from app.db.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/customer-segments", response_model=List[schemas.CustomerSegmentResponse])
async def get_customer_segments(
    db: Session = Depends(get_db)
):
    """Get customer segment distribution"""
    segments = db.query(models.CustomerSegment).all()
    return segments

@router.get("/product-performance", response_model=List[schemas.ProductPerformanceResponse])
async def get_product_performance(
    period: str = Query(..., description="Period in format YYYY-QN (e.g., 2023-Q2)"),
    db: Session = Depends(get_db)
):
    """Get product performance metrics"""
    performance = db.query(models.ProductPerformance).filter(
        models.ProductPerformance.period == period
    ).all()
    return performance

@router.get("/regional-performance", response_model=List[schemas.RegionalPerformanceResponse])
async def get_regional_performance(
    period: str = Query(..., description="Period in format YYYY-QN (e.g., 2023-Q2)"),
    db: Session = Depends(get_db)
):
    """Get regional performance metrics"""
    performance = db.query(models.RegionalPerformance).filter(
        models.RegionalPerformance.period == period
    ).all()
    return performance

@router.get("/monthly-trends", response_model=List[schemas.MonthlyTrendResponse])
async def get_monthly_trends(
    year: int = Query(..., description="Year to get trends for"),
    db: Session = Depends(get_db)
):
    """Get monthly financial trends"""
    trends = db.query(models.MonthlyTrend).filter(
        models.MonthlyTrend.year == year
    ).order_by(models.MonthlyTrend.month).all()
    return trends

@router.get("/customer-growth", response_model=List[schemas.CustomerGrowthResponse])
async def get_customer_growth(
    year: int = Query(..., description="Year to get growth data for"),
    db: Session = Depends(get_db)
):
    """Get customer growth metrics"""
    growth = db.query(models.CustomerGrowth).filter(
        models.CustomerGrowth.year == year
    ).order_by(models.CustomerGrowth.month).all()
    return growth

@router.get("/summary")
async def get_analytics_summary(
    db: Session = Depends(get_db)
):
    """Get summary analytics data"""
    # Get total customers from User table
    total_customers = db.query(func.count(models.User.id)).scalar() or 0
    
    # Get total assets (sum of all deposits)
    total_assets = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.transaction_type == models.TransactionType.CREDIT
    ).scalar() or 0
    
    # Get net cash flow for current month from MonthlyTrend
    current_month = datetime.now(UTC).strftime("%b")
    current_year = datetime.now(UTC).year
    
    monthly_trend = db.query(models.MonthlyTrend).filter(
        models.MonthlyTrend.month == current_month,
        models.MonthlyTrend.year == current_year
    ).first()
    
    net_cash_flow = monthly_trend.net_flow if monthly_trend else 0
    
    # If no data in MonthlyTrend, calculate from transactions
    if net_cash_flow == 0:
        current_month_start = datetime(current_year, datetime.now(UTC).month, 1)
        current_month_end = datetime(current_year, datetime.now(UTC).month + 1, 1) if datetime.now(UTC).month < 12 else datetime(current_year + 1, 1, 1)
        
        deposits = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.transaction_type == models.TransactionType.CREDIT,
            models.Transaction.created_at >= current_month_start,
            models.Transaction.created_at < current_month_end
        ).scalar() or 0
        
        withdrawals = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.transaction_type == models.TransactionType.DEBIT,
            models.Transaction.created_at >= current_month_start,
            models.Transaction.created_at < current_month_end
        ).scalar() or 0
        
        net_cash_flow = deposits - withdrawals
    
    return {
        "total_customers": total_customers,
        "total_assets": float(total_assets),
        "net_cash_flow": float(net_cash_flow)
    } 