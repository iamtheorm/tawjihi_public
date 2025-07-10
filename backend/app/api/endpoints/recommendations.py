from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import joinedload, Session
from typing import List
from app.models import models
from app.schemas import schemas
from app.db.database import get_db
from sqlalchemy import func, and_
<<<<<<< HEAD
from app.services.ai_recommendations import ai_service
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
=======
# import logging

# # Configure logging
# logging.basicConfig(level=logging.WARNING)
# logger = logging.getLogger(__name__)
>>>>>>> 862642420b4455b7edb635a13b1c4b2b62d5a1ce

# Main recommendations router
router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)

# Separate router for segments and products
segments_router = APIRouter(
    prefix="/segments",
    tags=["Segments"]
)

products_router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# Product Endpoints
@products_router.get("/", response_model=List[schemas.Product])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Product).offset(skip).limit(limit).all()

@router.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products/", response_model=List[schemas.Product])
def get_products_with_prefix(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Product).offset(skip).limit(limit).all()

# Segment Endpoints
@segments_router.get("/", response_model=List[schemas.Segment])
def get_segments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Segment).offset(skip).limit(limit).all()

@router.post("/segments/", response_model=schemas.Segment)
def create_segment(segment: schemas.SegmentCreate, db: Session = Depends(get_db)):
    db_segment = models.Segment(**segment.model_dump())
    db.add(db_segment)
    db.commit()
    db.refresh(db_segment)
    return db_segment

@router.get("/segments/", response_model=List[schemas.Segment])
def get_segments_with_prefix(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Segment).offset(skip).limit(limit).all()

# Recommendation Endpoints
@router.post("/", response_model=schemas.Recommendation)
def create_recommendation(recommendation: schemas.RecommendationCreate, db: Session = Depends(get_db)):
    db_recommendation = models.Recommendation(**recommendation.model_dump())
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)
    return db_recommendation

@router.get("/", response_model=List[schemas.RecommendationResponse])
def get_recommendations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    recommendations = (
        db.query(models.Recommendation)
        .options(joinedload(models.Recommendation.product), joinedload(models.Recommendation.segment))
        .offset(skip)
        .limit(limit)
        .all()
    )

    results = []
    for rec in recommendations:
        total_customers = db.query(models.CustomerRecommendation).filter(
            and_(
                models.CustomerRecommendation.product_id == rec.product_id,
                models.CustomerRecommendation.segment_id == rec.segment_id
            )
        ).count()

        accepted_customers = db.query(models.CustomerRecommendation).filter(
            and_(
                models.CustomerRecommendation.product_id == rec.product_id,
                models.CustomerRecommendation.segment_id == rec.segment_id,
                models.CustomerRecommendation.status == 'accepted'
            )
        ).count()

        conversion_rate = round((accepted_customers / total_customers) * 100, 2) if total_customers else 0.0

        result = schemas.RecommendationResponse(
            id=rec.id,
            product_id=rec.product_id,
            segment_id=rec.segment_id,
            product=rec.product,
            segment=rec.segment,
            potential=rec.potential,
            customer_count=total_customers,
            conversion_rate=conversion_rate
        )
        results.append(result)

    return results

# Campaign Endpoints
@router.post("/campaigns/", response_model=schemas.Campaign)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    db_campaign = models.Campaign(**campaign.model_dump())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

@router.get("/campaigns/", response_model=List[schemas.Campaign])
def get_campaigns(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Campaign).offset(skip).limit(limit).all()
<<<<<<< HEAD

# AI Recommendations Endpoints
@router.post("/generate/{customer_id}")
async def generate_ai_recommendations(
    customer_id: int,
    db: Session = Depends(get_db)
):
    """Generate AI-powered recommendations for a customer"""
    try:
        # Get customer from database
        customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Generate AI recommendations
        ai_recommendations = ai_service.get_recommendations(customer, top_n=3)
        
        # Store recommendations in database
        stored_recommendations = []
        for rec in ai_recommendations:
            # Check if product exists, create if not
            product = db.query(models.Product).filter(models.Product.name == rec['product_name']).first()
            if not product:
                product = models.Product(
                    name=rec['product_name'],
                    description=f"AI recommended {rec['product_name']} for customer profile"
                )
                db.add(product)
                db.commit()
                db.refresh(product)
            
            # Check if segment exists, create default if not
            segment = db.query(models.Segment).filter(models.Segment.name == "AI Generated").first()
            if not segment:
                segment = models.Segment(name="AI Generated")
                db.add(segment)
                db.commit()
                db.refresh(segment)
            
            # Create customer recommendation
            customer_rec = models.CustomerRecommendation(
                customer_id=customer_id,
                product_id=product.id,
                segment_id=segment.id,
                recommendation_reason=rec['recommendation_reason'],
                confidence_score=rec['confidence_score'],
                priority=str(rec['priority']),
                status="pending"
            )
            db.add(customer_rec)
            stored_recommendations.append(customer_rec)
        
        db.commit()
        
        # Refresh all recommendations to get IDs
        for rec in stored_recommendations:
            db.refresh(rec)
        
        logger.info(f"Generated {len(stored_recommendations)} AI recommendations for customer {customer_id}")
        
        return {
            "message": f"Successfully generated {len(stored_recommendations)} AI recommendations",
            "customer_id": customer_id,
            "recommendations": [
                {
                    "id": rec.id,
                    "product_name": rec.product.name,
                    "confidence_score": rec.confidence_score,
                    "priority": rec.priority,
                    "reason": rec.recommendation_reason
                }
                for rec in stored_recommendations
            ]
        }
        
    except Exception as e:
        logger.error(f"Error generating AI recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/customer/{customer_id}")
async def get_customer_recommendations(
    customer_id: int,
    db: Session = Depends(get_db)
):
    """Get all recommendations for a specific customer"""
    try:
        customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        recommendations = db.query(models.CustomerRecommendation)\
            .filter(models.CustomerRecommendation.customer_id == customer_id)\
            .options(joinedload(models.CustomerRecommendation.product))\
            .options(joinedload(models.CustomerRecommendation.segment))\
            .order_by(models.CustomerRecommendation.priority)\
            .all()
        
        return {
            "customer_id": customer_id,
            "customer_name": customer.name,
            "recommendations": [
                {
                    "id": rec.id,
                    "product_name": rec.product.name,
                    "product_description": rec.product.description,
                    "segment": rec.segment.name,
                    "confidence_score": rec.confidence_score,
                    "priority": rec.priority,
                    "reason": rec.recommendation_reason,
                    "status": rec.status,
                    "recommended_at": rec.recommended_at
                }
                for rec in recommendations
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting customer recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")

@router.post("/generate-all")
async def generate_recommendations_for_all_customers(db: Session = Depends(get_db)):
    """Generate AI recommendations for all customers who don't have recent recommendations"""
    try:
        # Get all customers
        customers = db.query(models.Customer).all()
        results = []
        
        for customer in customers:
            try:
                # Check if customer already has recent recommendations (within last 30 days)
                recent_recs = db.query(models.CustomerRecommendation)\
                    .filter(models.CustomerRecommendation.customer_id == customer.id)\
                    .filter(models.CustomerRecommendation.recommended_at >= datetime.utcnow().replace(day=1))\
                    .count()
                
                if recent_recs > 0:
                    results.append({
                        "customer_id": customer.id,
                        "status": "skipped",
                        "reason": "Recent recommendations exist"
                    })
                    continue
                
                # Generate recommendations
                ai_recommendations = ai_service.get_recommendations(customer, top_n=3)
                
                # Store in database
                for rec in ai_recommendations:
                    product = db.query(models.Product).filter(models.Product.name == rec['product_name']).first()
                    if not product:
                        product = models.Product(
                            name=rec['product_name'],
                            description=f"AI recommended {rec['product_name']}"
                        )
                        db.add(product)
                        db.commit()
                        db.refresh(product)
                    
                    segment = db.query(models.Segment).filter(models.Segment.name == "AI Generated").first()
                    if not segment:
                        segment = models.Segment(name="AI Generated")
                        db.add(segment)
                        db.commit()
                        db.refresh(segment)
                    
                    customer_rec = models.CustomerRecommendation(
                        customer_id=customer.id,
                        product_id=product.id,
                        segment_id=segment.id,
                        recommendation_reason=rec['recommendation_reason'],
                        confidence_score=rec['confidence_score'],
                        priority=str(rec['priority']),
                        status="pending"
                    )
                    db.add(customer_rec)
                
                db.commit()
                
                results.append({
                    "customer_id": customer.id,
                    "status": "success",
                    "recommendations_count": len(ai_recommendations)
                })
                
            except Exception as customer_error:
                logger.error(f"Error processing customer {customer.id}: {str(customer_error)}")
                results.append({
                    "customer_id": customer.id,
                    "status": "error",
                    "error": str(customer_error)
                })
        
        success_count = len([r for r in results if r["status"] == "success"])
        
        return {
            "message": f"Processed {len(customers)} customers, generated recommendations for {success_count}",
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error in bulk recommendation generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating bulk recommendations: {str(e)}")
=======
>>>>>>> 862642420b4455b7edb635a13b1c4b2b62d5a1ce
