from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
import logging
import csv
import io
import pandas as pd
from datetime import datetime

from app.db.database import get_db
from app.models.models import Customer, CustomerRecommendation, Product, Segment
from app.schemas.schemas import Customer as CustomerSchema, CustomerCreate, CSVUploadResponse
from app.services.recommendation_service import recommendation_service

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
        
        # Set created_at and updated_at to current datetime if not provided
        from datetime import datetime
        if 'created_at' not in customer_data or customer_data.get('created_at') is None:
            customer_data['created_at'] = datetime.utcnow()
        if 'updated_at' not in customer_data or customer_data.get('updated_at') is None:
            customer_data['updated_at'] = datetime.utcnow()
        
        db_customer = Customer(**customer_data)
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        
        logger.info(f"Successfully created customer: {db_customer.name}")
        
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
        return {"message": f"Customer {customer_id} deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting customer: {str(e)}")
        db.rollback()
        raise

# Generate recommendations for a specific customer
@router.post("/{customer_id}/generate-recommendations")
async def generate_recommendations_for_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        logger.info(f"Generating recommendations for customer with ID: {customer_id}")
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            logger.warning(f"Customer with ID {customer_id} not found")
            raise HTTPException(status_code=404, detail="Customer not found")
        
        await generate_and_store_recommendations(customer, db)
        
        # Get the generated recommendations to return
        recommendations = db.query(CustomerRecommendation).filter(
            CustomerRecommendation.customer_id == customer_id
        ).all()
        
        return {
            "message": f"Generated {len(recommendations)} recommendations for customer {customer_id}",
            "recommendations": [
                {
                    "product_name": db.query(Product).filter(Product.id == rec.product_id).first().name,
                    "confidence": rec.confidence_score,
                    "priority": rec.priority,
                    "reason": rec.recommendation_reason
                }
                for rec in recommendations
            ]
        }
    except Exception as e:
        logger.error(f"Error generating recommendations for customer: {str(e)}")
        raise

# Bulk generate recommendations for all customers without recommendations
@router.post("/bulk-generate-recommendations")
async def bulk_generate_recommendations(db: Session = Depends(get_db)):
    try:
        logger.info("Starting bulk recommendation generation")
        
        # Get all customers
        customers = db.query(Customer).all()
        generated_count = 0
        
        for customer in customers:
            try:
                await generate_and_store_recommendations(customer, db)
                generated_count += 1
                if generated_count % 10 == 0:
                    logger.info(f"Generated recommendations for {generated_count} customers")
            except Exception as e:
                logger.error(f"Error generating recommendations for customer {customer.id}: {str(e)}")
                continue
        
        return {
            "message": f"Bulk recommendation generation completed",
            "total_customers": len(customers),
            "generated_for": generated_count
        }
    except Exception as e:
        logger.error(f"Error in bulk recommendation generation: {str(e)}")
        raise

# Add CSV upload endpoint
@router.post("/upload-csv", response_model=CSVUploadResponse)
async def upload_customers_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Uploading CSV file: {file.filename}")
        
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV file")
        
        # Read CSV content
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Parse CSV using pandas for better handling
        df = pd.read_csv(io.StringIO(csv_content))
        
        total_rows = len(df)
        successful_imports = 0
        failed_imports = 0
        errors = []
        
        logger.info(f"Processing {total_rows} rows from CSV")
        
        # Define column mapping from CSV headers to database fields
        column_mapping = {
            'Name': 'name',
            'email': 'email',
            'Age': 'age',
            'Income_OMR': 'income_omr',
            'Employment_Type': 'employment_type',
            'Credit_Score': 'credit_score',
            'Account_Tenure_Months': 'account_tenure_months',
            'Marital_Status': 'marital_status_csv',
            'Number_of_Children': 'number_of_children',
            'Digital_Engagement_Score': 'digital_engagement_score',
            'Residence_Status': 'residence_status',
            'Nationality': 'nationality',
            'Religion': 'religion',
            'Account_Type': 'account_type',
            'Vehicle_Owner': 'vehicle_owner',
            'Drivers_License': 'drivers_license',
            'Monthly_Groceries_Spend': 'monthly_groceries_spend',
            'International_Travel_Frequency': 'international_travel_frequency',
            'Risk_Tolerance': 'risk_tolerance',
            'Student_Status': 'student_status',
            'Employer_Insurance': 'employer_insurance',
            'Debt_to_Income': 'debt_to_income',
            'Business_Account_Owner': 'business_account_owner',
            'Already_Has_Products': 'already_has_products',
            'Do_Not_Need_Products': 'do_not_need_products',
            'Recent_Transactions': 'recent_transactions',
            'Education_Level': 'education_level',
            'Gender': 'gender',
            'Occupation_Sector': 'occupation_sector',
            'Health_Score': 'health_score',
            'Property_Value_OMR': 'property_value_omr',
            'Vehicle_Value_OMR': 'vehicle_value_omr',
            'Credit_Utilization_Pct': 'credit_utilization_pct',
            'Avg_Days_Abroad_Per_Year': 'avg_days_abroad_per_year',
            'Digital_Channel_Preference': 'digital_channel_preference'
        }
        
        for index, row in df.iterrows():
            try:
                # Generate account number if not provided
                account_number = f"ACC{str(index + 1).zfill(6)}"
                
                # Map CSV data to database fields
                customer_data = {
                    'account': account_number,
                    'segment': 'retail',  # Default segment
                    'status': 'active',   # Default status
                    'recommendation': 'Medium',  # Default recommendation
                    'potential': 'Medium'  # Default potential
                }
                
                # Map CSV columns to database fields
                for csv_col, db_field in column_mapping.items():
                    if csv_col in df.columns and pd.notna(row[csv_col]):
                        value = row[csv_col]
                        
                        # Handle special cases
                        if db_field == 'email':
                            customer_data[db_field] = str(value).lower().strip()
                        elif db_field == 'name':
                            customer_data[db_field] = str(value).strip()
                        else:
                            customer_data[db_field] = value
                
                # Validate required fields
                if 'name' not in customer_data or not customer_data['name']:
                    raise ValueError("Name is required")
                if 'email' not in customer_data or not customer_data['email']:
                    raise ValueError("Email is required")
                
                # Check for duplicate email
                existing_customer = db.query(Customer).filter(
                    func.lower(Customer.email) == func.lower(customer_data['email'])
                ).first()
                
                if existing_customer:
                    errors.append({
                        'row': index + 1,
                        'email': customer_data['email'],
                        'error': 'Email already exists'
                    })
                    failed_imports += 1
                    continue
                  # Create customer
                db_customer = Customer(**customer_data)
                db.add(db_customer)
                db.commit()
                db.refresh(db_customer)
                
                # Generate AI recommendations for the imported customer
                await generate_and_store_recommendations(db_customer, db)
                
                successful_imports += 1
                logger.info(f"Successfully imported customer: {customer_data['name']}")
                
            except Exception as row_error:
                db.rollback()
                error_msg = str(row_error)
                errors.append({
                    'row': index + 1,
                    'error': error_msg
                })
                failed_imports += 1
                logger.error(f"Error importing row {index + 1}: {error_msg}")
        
        response = CSVUploadResponse(
            message=f"CSV upload completed. {successful_imports} customers imported successfully, {failed_imports} failed.",
            total_rows=total_rows,
            successful_imports=successful_imports,
            failed_imports=failed_imports,
            errors=errors
        )
        
        logger.info(f"CSV upload completed: {successful_imports} successful, {failed_imports} failed")
        return response
        
    except Exception as e:
        logger.error(f"Error processing CSV upload: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file: {str(e)}")

async def generate_and_store_recommendations(customer: Customer, db: Session):
    """Generate AI recommendations for a customer and store them in the database"""
    try:
        # Generate recommendations using AI model
        ai_recommendations = recommendation_service.predict_recommendations(customer)
        
        # Clear existing recommendations for this customer
        db.query(CustomerRecommendation).filter(
            CustomerRecommendation.customer_id == customer.id
        ).delete()
        
        # Get or create products and segments
        for rec in ai_recommendations:
            # Find or create product
            product = db.query(Product).filter(Product.name == rec["product_name"]).first()
            if not product:
                product = Product(
                    name=rec["product_name"],
                    description=f"AI-recommended {rec['product_name']} for customer profile",
                    category="Banking Product"
                )
                db.add(product)
                db.commit()
                db.refresh(product)
            
            # Get default segment (you can enhance this logic)
            segment = db.query(Segment).first()
            if not segment:
                segment = Segment(name="AI Generated", description="AI-generated recommendations")
                db.add(segment)
                db.commit()
                db.refresh(segment)
            
            # Create recommendation record
            db_recommendation = CustomerRecommendation(
                customer_id=customer.id,
                product_id=product.id,
                segment_id=segment.id,
                status="pending",
                recommendation_reason=f"AI-generated recommendation with {rec['confidence']:.2%} confidence",
                confidence_score=rec["confidence"],
                priority=rec["priority"],
                recommended_at=datetime.utcnow()
            )
            db.add(db_recommendation)
        
        db.commit()
        logger.info(f"Generated {len(ai_recommendations)} recommendations for customer {customer.id}")
        
    except Exception as e:
        logger.error(f"Error generating recommendations for customer {customer.id}: {str(e)}")
        db.rollback()