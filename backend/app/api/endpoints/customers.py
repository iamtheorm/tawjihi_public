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

        # Map string values to enum values
        # Employment type mapping
        employment_type_mapping = {
            'Salaried': 'SALARIED',
            'Self-Employed': 'SELF_EMPLOYED',
            'Student': 'STUDENT',
            'Retired': 'RETIRED',
            'Full-Time': 'FULL_TIME',
            'Part-Time': 'PART_TIME',
            'Contract': 'CONTRACT',
            'Freelance': 'FREELANCE'
        }
        if customer_data.get('employment_type'):
            employment_type = str(customer_data['employment_type']).strip()
            if employment_type in employment_type_mapping:
                customer_data['employment_type'] = employment_type_mapping[employment_type]
            else:
                # Try to convert to uppercase with underscores
                customer_data['employment_type'] = employment_type.upper().replace('-', '_').replace(' ', '_')

        # Nationality mapping
        nationality_mapping = {
            'OM': 'OMANI',
            'Omani': 'OMANI',
            'Non-OM': 'NON_OMANI',
            'Non-Omani': 'NON_OMANI',
            'EG': 'EG'
        }
        if customer_data.get('nationality'):
            nationality = str(customer_data['nationality']).strip()
            if nationality in nationality_mapping:
                customer_data['nationality'] = nationality_mapping[nationality]
            else:
                customer_data['nationality'] = nationality.upper().replace('-', '_')

        # Marital status mapping
        marital_status_mapping = {
            'Single': 'SINGLE',
            'Married': 'MARRIED',
            'Divorced': 'DIVORCED',
            'Widowed': 'WIDOWED'
        }
        if customer_data.get('marital_status_csv'):
            marital_status = str(customer_data['marital_status_csv']).strip()
            if marital_status in marital_status_mapping:
                customer_data['marital_status_csv'] = marital_status_mapping[marital_status]
            else:
                customer_data['marital_status_csv'] = marital_status.upper()

        # Residence status mapping
        residence_status_mapping = {
            'Owned': 'OWNED',
            'Rented': 'RENTED',
            'Mortgaged': 'MORTGAGED',
            'Family': 'FAMILY'
        }
        if customer_data.get('residence_status'):
            residence_status = str(customer_data['residence_status']).strip()
            if residence_status in residence_status_mapping:
                customer_data['residence_status'] = residence_status_mapping[residence_status]
            else:
                customer_data['residence_status'] = residence_status.upper()

        # Religion mapping
        religion_mapping = {
            'Muslim': 'MUSLIM',
            'Christian': 'CHRISTIAN',
            'Hindu': 'HINDU',
            'Buddhist': 'BUDDHIST',
            'Sikh': 'SIKH',
            'Jewish': 'JEWISH',
            'Other': 'OTHER'
        }
        if customer_data.get('religion'):
            religion = str(customer_data['religion']).strip()
            if religion in religion_mapping:
                customer_data['religion'] = religion_mapping[religion]
            else:
                customer_data['religion'] = religion.upper()

        # Account type mapping
        account_type_mapping = {
            'Savings': 'SAVINGS',
            'Current': 'CURRENT',
            'Checking': 'CHECKING',
            'Investment': 'INVESTMENT',
            'Business': 'BUSINESS',
            'Joint': 'JOINT',
            'Salary': 'SALARY'
        }
        if customer_data.get('account_type'):
            account_type = str(customer_data['account_type']).strip()
            if account_type in account_type_mapping:
                customer_data['account_type'] = account_type_mapping[account_type]
            else:
                customer_data['account_type'] = account_type.upper()

        # Yes/No mapping
        yes_no_mapping = {
            'Yes': 'YES',
            'No': 'NO',
            'Y': 'YES',
            'N': 'NO',
            'True': 'YES',
            'False': 'NO',
            '1': 'YES',
            '0': 'NO'
        }
        for field in ['vehicle_owner', 'drivers_license', 'student_status', 'employer_insurance', 'business_account_owner']:
            if customer_data.get(field):
                value = str(customer_data[field]).strip()
                if value in yes_no_mapping:
                    customer_data[field] = yes_no_mapping[value]
                else:
                    customer_data[field] = value.upper()

        # Risk tolerance mapping
        risk_tolerance_mapping = {
            'Low': 'LOW',
            'Medium': 'MEDIUM',
            'High': 'HIGH'
        }
        if customer_data.get('risk_tolerance'):
            risk_tolerance = str(customer_data['risk_tolerance']).strip()
            if risk_tolerance in risk_tolerance_mapping:
                customer_data['risk_tolerance'] = risk_tolerance_mapping[risk_tolerance]
            else:
                customer_data['risk_tolerance'] = risk_tolerance.upper()

        # Education level mapping
        education_level_mapping = {
            'High School': 'HIGH_SCHOOL',
            'Bachelor': 'BACHELOR',
            'Bachelors': 'BACHELORS',
            'Master': 'MASTER',
            'Masters': 'MASTERS',
            'PhD': 'PHD',
            'Diploma': 'DIPLOMA',
            'Associate': 'ASSOCIATE',
            'Doctorate': 'DOCTORATE'
        }
        if customer_data.get('education_level'):
            education_level = str(customer_data['education_level']).strip()
            if education_level in education_level_mapping:
                customer_data['education_level'] = education_level_mapping[education_level]
            else:
                customer_data['education_level'] = education_level.upper().replace(' ', '_')

        # Gender mapping
        gender_mapping = {
            'Male': 'MALE',
            'Female': 'FEMALE',
            'M': 'MALE',
            'F': 'FEMALE',
            'Other': 'OTHER'
        }
        if customer_data.get('gender'):
            gender = str(customer_data['gender']).strip()
            if gender in gender_mapping:
                customer_data['gender'] = gender_mapping[gender]
            else:
                customer_data['gender'] = gender.upper()

        # Occupation sector mapping
        occupation_sector_mapping = {
            'Private': 'PRIVATE',
            'Public': 'PUBLIC',
            'Government': 'GOVERNMENT',
            'Student': 'STUDENT',
            'Self-Employed': 'SELF_EMPLOYED',
            'Retired': 'RETIRED',
            'Unemployed': 'UNEMPLOYED',
            'Education': 'EDUCATION',
            'Healthcare': 'HEALTHCARE',
            'Technology': 'TECHNOLOGY',
            'Finance': 'FINANCE',
            'Manufacturing': 'MANUFACTURING',
            'Retail': 'RETAIL',
            'Construction': 'CONSTRUCTION',
            'Transportation': 'TRANSPORTATION',
            'Hospitality': 'HOSPITALITY',
            'Agriculture': 'AGRICULTURE',
            'Media': 'MEDIA',
            'Legal': 'LEGAL',
            'Consulting': 'CONSULTING',
            'IT': 'IT',
            'Other': 'OTHER'
        }
        if customer_data.get('occupation_sector'):
            occupation_sector = str(customer_data['occupation_sector']).strip()
            if occupation_sector in occupation_sector_mapping:
                customer_data['occupation_sector'] = occupation_sector_mapping[occupation_sector]
            else:
                customer_data['occupation_sector'] = occupation_sector.upper().replace(' ', '_')

        # Digital channel preference mapping
        digital_channel_preference_mapping = {
            'Mobile': 'MOBILE',
            'Web': 'WEB',
            'Branch': 'BRANCH',
            'Phone': 'PHONE',
            'ATM': 'ATM',
            'Online': 'ONLINE',
            'In-Person': 'IN_PERSON',
            'Digital': 'DIGITAL',
            'Traditional': 'TRADITIONAL'
        }
        if customer_data.get('digital_channel_preference'):
            digital_channel = str(customer_data['digital_channel_preference']).strip()
            if digital_channel in digital_channel_preference_mapping:
                customer_data['digital_channel_preference'] = digital_channel_preference_mapping[digital_channel]
            else:
                customer_data['digital_channel_preference'] = digital_channel.upper().replace('-', '_')

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

        # Employment type mapping from CSV values to enum values
        employment_type_mapping = {
            'Salaried': 'SALARIED',
            'Self-Employed': 'SELF_EMPLOYED',
            'Student': 'STUDENT',
            'Retired': 'RETIRED',
            'Full-Time': 'FULL_TIME',
            'Part-Time': 'PART_TIME',
            'Contract': 'CONTRACT',
            'Freelance': 'FREELANCE'
        }

        # Nationality mapping from CSV values to enum values
        nationality_mapping = {
            'OM': 'OMANI',
            'Omani': 'OMANI',
            'Non-OM': 'NON_OMANI',
            'Non-Omani': 'NON_OMANI',
            'EG': 'EG'
        }

        # Marital status mapping from CSV values to enum values
        marital_status_mapping = {
            'Single': 'SINGLE',
            'Married': 'MARRIED',
            'Divorced': 'DIVORCED',
            'Widowed': 'WIDOWED'
        }

        # Residence status mapping from CSV values to enum values
        residence_status_mapping = {
            'Owned': 'OWNED',
            'Rented': 'RENTED',
            'Mortgaged': 'MORTGAGED',
            'Family': 'FAMILY'
        }

        # Religion mapping from CSV values to enum values
        religion_mapping = {
            'Muslim': 'MUSLIM',
            'Christian': 'CHRISTIAN',
            'Hindu': 'HINDU',
            'Buddhist': 'BUDDHIST',
            'Sikh': 'SIKH',
            'Jewish': 'JEWISH',
            'Other': 'OTHER'
        }

        # Account type mapping from CSV values to enum values
        account_type_mapping = {
            'Savings': 'SAVINGS',
            'Current': 'CURRENT',
            'Checking': 'CHECKING',
            'Investment': 'INVESTMENT',
            'Business': 'BUSINESS',
            'Joint': 'JOINT'
        }

        # Yes/No mapping from CSV values to enum values
        yes_no_mapping = {
            'Yes': 'YES',
            'No': 'NO',
            'Y': 'YES',
            'N': 'NO',
            'True': 'YES',
            'False': 'NO',
            '1': 'YES',
            '0': 'NO'
        }

        # Risk tolerance mapping from CSV values to enum values
        risk_tolerance_mapping = {
            'Low': 'LOW',
            'Medium': 'MEDIUM',
            'High': 'HIGH'
        }

        # Education level mapping from CSV values to enum values
        education_level_mapping = {
            'High School': 'HIGH_SCHOOL',
            'Bachelor': 'BACHELOR',
            'Master': 'MASTER',
            'PhD': 'PHD',
            'Diploma': 'DIPLOMA',
            'Associate': 'ASSOCIATE',
            'Doctorate': 'DOCTORATE'
        }

        # Gender mapping from CSV values to enum values
        gender_mapping = {
            'Male': 'MALE',
            'Female': 'FEMALE',
            'M': 'MALE',
            'F': 'FEMALE',
            'Other': 'OTHER'
        }

        # Occupation sector mapping from CSV values to enum values
        occupation_sector_mapping = {
            'Private': 'PRIVATE',
            'Public': 'PUBLIC',
            'Government': 'GOVERNMENT',
            'Student': 'STUDENT',
            'Self-Employed': 'SELF_EMPLOYED',
            'Retired': 'RETIRED',
            'Unemployed': 'UNEMPLOYED',
            'Education': 'EDUCATION',
            'Healthcare': 'HEALTHCARE',
            'Technology': 'TECHNOLOGY',
            'Finance': 'FINANCE',
            'Manufacturing': 'MANUFACTURING',
            'Retail': 'RETAIL',
            'Construction': 'CONSTRUCTION',
            'Transportation': 'TRANSPORTATION',
            'Hospitality': 'HOSPITALITY',
            'Agriculture': 'AGRICULTURE',
            'Media': 'MEDIA',
            'Legal': 'LEGAL',
            'Consulting': 'CONSULTING'
        }

        # Digital channel preference mapping from CSV values to enum values
        digital_channel_preference_mapping = {
            'Mobile': 'MOBILE',
            'Web': 'WEB',
            'Branch': 'BRANCH',
            'Phone': 'PHONE',
            'ATM': 'ATM',
            'Online': 'ONLINE',
            'In-Person': 'IN_PERSON',
            'Digital': 'DIGITAL',
            'Traditional': 'TRADITIONAL'
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
                        logger.info(f"Processing field '{db_field}' with value: {value} (type: {type(value)})")
                        
                        # Handle special cases
                        if db_field == 'email':
                            customer_data[db_field] = str(value).lower().strip()
                        elif db_field == 'name':
                            customer_data[db_field] = str(value).strip()
                        elif db_field == 'employment_type':
                            # Map CSV employment type to enum value
                            csv_employment_type = str(value).strip()
                            if csv_employment_type in employment_type_mapping:
                                customer_data[db_field] = employment_type_mapping[csv_employment_type]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_employment_type.upper().replace('-', '_')
                        elif db_field == 'marital_status_csv':
                            # Map CSV marital status to enum value
                            csv_marital_status = str(value).strip()
                            if csv_marital_status in marital_status_mapping:
                                customer_data[db_field] = marital_status_mapping[csv_marital_status]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_marital_status.upper()
                        elif db_field == 'residence_status':
                            # Map CSV residence status to enum value
                            csv_residence_status = str(value).strip()
                            if csv_residence_status in residence_status_mapping:
                                customer_data[db_field] = residence_status_mapping[csv_residence_status]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_residence_status.upper()
                        elif db_field == 'religion':
                            # Map CSV religion to enum value
                            csv_religion = str(value).strip()
                            if csv_religion in religion_mapping:
                                customer_data[db_field] = religion_mapping[csv_religion]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_religion.upper()
                        elif db_field == 'account_type':
                            # Map CSV account type to enum value
                            csv_account_type = str(value).strip()
                            if csv_account_type in account_type_mapping:
                                customer_data[db_field] = account_type_mapping[csv_account_type]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_account_type.upper()
                        elif db_field in ['vehicle_owner', 'drivers_license', 'student_status', 'employer_insurance', 'business_account_owner']:
                            # Map CSV yes/no values to enum values
                            csv_yes_no = str(value).strip()
                            if csv_yes_no in yes_no_mapping:
                                customer_data[db_field] = yes_no_mapping[csv_yes_no]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_yes_no.upper()
                        elif db_field == 'risk_tolerance':
                            # Map CSV risk tolerance to enum value
                            csv_risk_tolerance = str(value).strip()
                            if csv_risk_tolerance in risk_tolerance_mapping:
                                customer_data[db_field] = risk_tolerance_mapping[csv_risk_tolerance]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_risk_tolerance.upper()
                        elif db_field == 'education_level':
                            # Map CSV education level to enum value
                            csv_education_level = str(value).strip()
                            if csv_education_level in education_level_mapping:
                                customer_data[db_field] = education_level_mapping[csv_education_level]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_education_level.upper().replace(' ', '_')
                        elif db_field == 'gender':
                            # Map CSV gender to enum value
                            csv_gender = str(value).strip()
                            if csv_gender in gender_mapping:
                                customer_data[db_field] = gender_mapping[csv_gender]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_gender.upper()
                        elif db_field == 'occupation_sector':
                            # Map CSV occupation sector to enum value
                            csv_occupation_sector = str(value).strip()
                            if csv_occupation_sector in occupation_sector_mapping:
                                customer_data[db_field] = occupation_sector_mapping[csv_occupation_sector]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_occupation_sector.upper().replace(' ', '_')
                        elif db_field == 'digital_channel_preference':
                            # Map CSV digital channel preference to enum value
                            csv_digital_channel_preference = str(value).strip()
                            if csv_digital_channel_preference in digital_channel_preference_mapping:
                                customer_data[db_field] = digital_channel_preference_mapping[csv_digital_channel_preference]
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                customer_data[db_field] = csv_digital_channel_preference.upper().replace('-', '_')
                        elif db_field == 'nationality':
                            # Map CSV nationality to enum value
                            csv_nationality = str(value).strip()
                            logger.info(f"Processing nationality: '{csv_nationality}'")
                            if csv_nationality in nationality_mapping:
                                mapped_value = nationality_mapping[csv_nationality]
                                logger.info(f"Mapped '{csv_nationality}' to '{mapped_value}'")
                                customer_data[db_field] = mapped_value
                            else:
                                # If not found in mapping, try to use the value as-is (for enum values)
                                fallback_value = csv_nationality.upper().replace('-', '_')
                                logger.info(f"No mapping found for '{csv_nationality}', using fallback: '{fallback_value}'")
                                customer_data[db_field] = fallback_value
                        elif db_field in ['age', 'credit_score', 'account_tenure_months', 'number_of_children', 'digital_engagement_score', 'international_travel_frequency', 'already_has_products', 'do_not_need_products', 'recent_transactions', 'health_score', 'avg_days_abroad_per_year']:
                            # Handle numeric fields
                            try:
                                if pd.isna(value):
                                    logger.warning(f"Field '{db_field}' is NaN, setting to None")
                                    customer_data[db_field] = None
                                else:
                                    customer_data[db_field] = int(value) if db_field in ['age', 'credit_score', 'account_tenure_months', 'number_of_children', 'digital_engagement_score', 'international_travel_frequency', 'already_has_products', 'do_not_need_products', 'recent_transactions', 'health_score', 'avg_days_abroad_per_year'] else float(value)
                            except (ValueError, TypeError) as e:
                                logger.error(f"Invalid value for numeric field '{db_field}': {value} - {str(e)}")
                                raise ValueError(f"Invalid value for {db_field}: {value}")
                        elif db_field in ['income_omr', 'monthly_groceries_spend', 'debt_to_income', 'property_value_omr', 'vehicle_value_omr', 'credit_utilization_pct']:
                            # Handle float fields
                            try:
                                if pd.isna(value):
                                    logger.warning(f"Field '{db_field}' is NaN, setting to None")
                                    customer_data[db_field] = None
                                else:
                                    customer_data[db_field] = float(value)
                            except (ValueError, TypeError) as e:
                                logger.error(f"Invalid value for float field '{db_field}': {value} - {str(e)}")
                                raise ValueError(f"Invalid value for {db_field}: {value}")
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