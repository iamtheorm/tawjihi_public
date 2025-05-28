from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from app.db.database import get_db
from app.models.models import Customer
from app.schemas.schemas import Customer as CustomerSchema, CustomerCreate

router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

# Get customers with optional filters, search, and pagination
@router.get("/", response_model=List[CustomerSchema])
async def get_customers(
    search: Optional[str] = Query(None),
    segment: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    potential: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Customer)

    if search:
        query = query.filter(
            or_(
                Customer.name.ilike(f"%{search}%"),
                Customer.email.ilike(f"%{search}%")
            )
        )
    if segment:
        query = query.filter(Customer.segment == segment)
    if status:
        query = query.filter(Customer.status == status)
    if potential:
        query = query.filter(Customer.potential == potential)

    customers = query.offset(skip).limit(limit).all()
    return customers

# Add a new customer with duplicate email check
@router.post("/", response_model=CustomerSchema)
async def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_customer = db.query(Customer).filter(Customer.email == customer.email).first()
    if existing_customer:
        raise HTTPException(status_code=400, detail="Customer with this email already exists.")

    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# Get a single customer by ID
@router.get("/{customer_id}", response_model=CustomerSchema)
async def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

# Update a customer by ID
@router.put("/{customer_id}", response_model=CustomerSchema)
async def update_customer(customer_id: int, updated_data: CustomerCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    for field, value in updated_data.dict().items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)
    return customer

# Delete a customer by ID
@router.delete("/{customer_id}")
async def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"} 