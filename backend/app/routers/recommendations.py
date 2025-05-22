from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import joinedload, Session
from typing import List
from .. import models, schemas
from ..database import SessionLocal
from sqlalchemy import func, and_

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Product Endpoints
# ----------------------------

@router.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products/", response_model=List[schemas.Product])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Product).offset(skip).limit(limit).all()

# ----------------------------
# Segment Endpoints
# ----------------------------

@router.post("/segments/", response_model=schemas.Segment)
def create_segment(segment: schemas.SegmentCreate, db: Session = Depends(get_db)):
    db_segment = models.Segment(**segment.model_dump())
    db.add(db_segment)
    db.commit()
    db.refresh(db_segment)
    return db_segment

@router.get("/segments/", response_model=List[schemas.Segment])
def get_segments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(models.Segment).offset(skip).limit(limit).all()

# ----------------------------
# Recommendation Endpoints
# ----------------------------

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
        # Fetch total customers for this recommendation's product and segment
        total_customers = db.query(models.CustomerRecommendation).filter(
            and_(
                models.CustomerRecommendation.product_id == rec.product_id,
                models.CustomerRecommendation.segment_id == rec.segment_id
            )
        ).count()

        # Fetch accepted customers
        accepted_customers = db.query(models.CustomerRecommendation).filter(
            and_(
                models.CustomerRecommendation.product_id == rec.product_id,
                models.CustomerRecommendation.segment_id == rec.segment_id,
                models.CustomerRecommendation.status == 'accepted'
            )
        ).count()

        # Calculate conversion rate
        conversion_rate = round((accepted_customers / total_customers) * 100, 2) if total_customers else 0.0

        results.append(
            schemas.RecommendationResponse(
                id=rec.id,
                product_id=rec.product_id,
                segment_id=rec.segment_id,
                product=rec.product,
                segment=rec.segment,
                potential=rec.potential,
                customer_count=total_customers,
                conversion_rate=conversion_rate
            )
        )

    return results

# ----------------------------
# Campaign Endpoints
# ----------------------------

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
