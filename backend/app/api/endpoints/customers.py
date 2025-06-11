from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
import logging

from app.db.database import get_db
from app.models.models import Customer
from app.schemas.schemas import Customer as CustomerSchema, CustomerCreate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

# Get customers with optional filters, search, and pagination
@router.get("/", response_model=List[CustomerSchema])
@router.get("", response_model=List[CustomerSchema])  # Handle both with and without trailing slash
async def get_customers(
    search: Optional[str] = Query(None),
    segment: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    potential: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),  # Ensure skip is not negative
    limit: int = Query(20, ge=1, le=100),  # Ensure limit is between 1 and 100
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Customer)
        logger.info(f"Fetching customers with filters: search={search}, segment={segment}, status={status}, potential={potential}")

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
        logger.info(f"Found {len(customers)} customers")
        return customers
    except Exception as e:
        logger.error(f"Error fetching customers: {str(e)}")
        raise

@router.get("/count")
@router.get("/count/")  # Handle both with and without trailing slash
async def get_customers_count(
    search: Optional[str] = Query(None),
    segment: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    potential: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Customer)
        logger.info(f"Counting customers with filters: search={search}, segment={segment}, status={status}, potential={potential}")

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

        total = query.count()
        logger.info(f"Total customers count: {total}")
        return {"total": total}
    except Exception as e:
        logger.error(f"Error counting customers: {str(e)}")
        raise

# Add a new customer with duplicate email check
@router.post("/", response_model=CustomerSchema)
async def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Creating new customer: {customer.dict()}")
        
        # Check if email already exists (case-insensitive)
        existing_customer = db.query(Customer).filter(
            func.lower(Customer.email) == func.lower(customer.email)
        ).first()
        
        if existing_customer:
            logger.warning(f"Customer with email {customer.email} already exists")
            raise HTTPException(status_code=400, detail="Customer with this email already exists.")

        # Convert email to lowercase before saving
        customer_data = customer.dict()
        customer_data['email'] = customer_data['email'].lower()
        
        db_customer = Customer(**customer_data)
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        
        logger.info(f"Successfully created customer with ID: {db_customer.id}")
        return db_customer
    except Exception as e:
        logger.error(f"Error creating customer: {str(e)}")
        db.rollback()
        raise

# Add a duplicate route handler for POST without trailing slash
@router.post("", response_model=CustomerSchema)
async def create_customer_no_slash(customer: CustomerCreate, db: Session = Depends(get_db)):
    return await create_customer(customer, db)

# Get a single customer by ID
@router.get("/{customer_id}", response_model=CustomerSchema)
async def get_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        logger.info(f"Fetching customer with ID: {customer_id}")
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            logger.warning(f"Customer with ID {customer_id} not found")
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
    except Exception as e:
        logger.error(f"Error fetching customer: {str(e)}")
        raise

# Update a customer by ID
@router.put("/{customer_id}", response_model=CustomerSchema)
async def update_customer(customer_id: int, updated_data: CustomerCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Updating customer with ID: {customer_id}")
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            logger.warning(f"Customer with ID {customer_id} not found")
            raise HTTPException(status_code=404, detail="Customer not found")
        
        for field, value in updated_data.dict().items():
            setattr(customer, field, value)

        db.commit()
        db.refresh(customer)
        logger.info(f"Successfully updated customer with ID: {customer_id}")
        return customer
    except Exception as e:
        logger.error(f"Error updating customer: {str(e)}")
        db.rollback()
        raise

# Delete a customer by ID
@router.delete("/{customer_id}")
async def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        logger.info(f"Deleting customer with ID: {customer_id}")
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            logger.warning(f"Customer with ID {customer_id} not found")
            raise HTTPException(status_code=404, detail="Customer not found")
        
        db.delete(customer)
        db.commit()
        logger.info(f"Successfully deleted customer with ID: {customer_id}")
        return {"message": "Customer deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting customer: {str(e)}")
        db.rollback()
        raise 