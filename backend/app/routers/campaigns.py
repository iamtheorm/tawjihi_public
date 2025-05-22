from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, crud
from ..database import get_db

router = APIRouter()

@router.post("/campaigns", response_model=schemas.CampaignCreate)
def schedule_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    # Optional: Add validation (e.g. check product and segment exist)
    return crud.create_campaign(db, campaign)
# Get all segments
@router.get("/segments", response_model=List[schemas.SegmentOut])
def get_segments(db: Session = Depends(get_db)):
    return db.query(models.Segment).all()

# Get all products
@router.get("/products", response_model=List[schemas.ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()
