from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from .. import models, schemas
from ..database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get customers with optional filters, search, and pagination
@router.get("/", response_model=List[schemas.Customer])
def get_customers(
    search: Optional[str] = Query(None),
    segment: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    potential: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(models.Customer)

    if search:
        query = query.filter(
            or_(
                models.Customer.name.ilike(f"%{search}%"),
                models.Customer.email.ilike(f"%{search}%")
            )
        )
    if segment:
        query = query.filter(models.Customer.segment == segment)
    if status:
        query = query.filter(models.Customer.status == status)
    if potential:
        query = query.filter(models.Customer.potential == potential)

    customers = query.offset(skip).limit(limit).all()
    return customers

# Add a new customer with duplicate email check
@router.post("/", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_customer = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if existing_customer:
        raise HTTPException(status_code=400, detail="Customer with this email already exists.")

    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# Get a single customer by ID
@router.get("/{customer_id}", response_model=schemas.Customer)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

# Update a customer by ID
@router.put("/{customer_id}", response_model=schemas.Customer)
def update_customer(customer_id: int, updated_data: schemas.CustomerCreate, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    for field, value in updated_data.dict().items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)
    return customer

# Delete a customer by ID
@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}
