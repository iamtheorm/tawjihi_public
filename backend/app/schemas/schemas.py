from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.models import (
    EmploymentStatus, MaritalStatus, EmploymentType, MaritalStatusCSV, 
    ResidenceStatus, Nationality, Religion, AccountType, YesNo, 
    RiskTolerance, EducationLevel, Gender, OccupationSector, 
    DigitalChannelPreference
)
from enum import Enum

# Auth Schemas
class UserBase(BaseModel):
    account_number: str
    industry: Optional[str] = None
    occupation: Optional[str] = None
    organisation: Optional[str] = None
    residence: Optional[str] = None
    date_of_birth: Optional[str] = None
    employment_status: Optional[EmploymentStatus] = None
    basic_salary: Optional[float] = None
    expected_monthly_income: Optional[float] = None
    permanent_address_line1: Optional[str] = None
    city: Optional[str] = None
    post_code: Optional[str] = None
    nationality: Optional[str] = None
    marital_status: Optional[MaritalStatus] = None

class UserCreate(UserBase):
    pass

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserResponse):
    pass

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Transaction Schemas
class TransactionType(str, Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

class Transaction(BaseModel):
    id: int
    account_number: str
    transaction_type: str
    amount: float
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    account: str
    segment: Optional[str] = None
    status: Optional[str] = None
    recommendation: Optional[str] = None
    potential: Optional[str] = None
    
    # Additional CSV fields
    age: Optional[int] = None
    income_omr: Optional[float] = None
    employment_type: Optional[EmploymentType] = None
    credit_score: Optional[int] = None
    account_tenure_months: Optional[int] = None
    marital_status_csv: Optional[MaritalStatusCSV] = None
    number_of_children: Optional[int] = None
    digital_engagement_score: Optional[int] = None
    residence_status: Optional[ResidenceStatus] = None
    nationality: Optional[Nationality] = None
    religion: Optional[Religion] = None
    account_type: Optional[AccountType] = None
    vehicle_owner: Optional[YesNo] = None
    drivers_license: Optional[YesNo] = None
    monthly_groceries_spend: Optional[float] = None
    international_travel_frequency: Optional[int] = None
    risk_tolerance: Optional[RiskTolerance] = None
    student_status: Optional[YesNo] = None
    employer_insurance: Optional[YesNo] = None
    debt_to_income: Optional[float] = None
    business_account_owner: Optional[YesNo] = None
    already_has_products: Optional[int] = None
    do_not_need_products: Optional[int] = None
    recent_transactions: Optional[int] = None
    education_level: Optional[EducationLevel] = None
    gender: Optional[Gender] = None
    occupation_sector: Optional[OccupationSector] = None
    health_score: Optional[int] = None
    property_value_omr: Optional[float] = None
    vehicle_value_omr: Optional[float] = None
    credit_utilization_pct: Optional[float] = None
    avg_days_abroad_per_year: Optional[int] = None
    digital_channel_preference: Optional[DigitalChannelPreference] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# CSV Upload Schemas
class CSVUploadResponse(BaseModel):
    message: str
    total_rows: int
    successful_imports: int
    failed_imports: int
    errors: List[Dict[str, Any]] = []

class UserProfile(BaseModel):
    industry: Optional[str] = None
    occupation: Optional[str] = None
    employment_status: Optional[str] = None
    basic_salary: Optional[float] = None

    class Config:
        from_attributes = True

class CustomerProfile(BaseModel):
    customer: Customer
    user: Optional[UserResponse] = None
    transactions: List[Transaction]
    recommendations: List[Dict[str, Any]]

    class Config:
        from_attributes = True

class CustomerProfileCreate(BaseModel):
    customer_id: int
    industry: Optional[str] = None
    occupation: Optional[str] = None
    employment_status: Optional[str] = None
    basic_salary: Optional[float] = None

class CustomerProfileUpdate(BaseModel):
    industry: Optional[str] = None
    occupation: Optional[str] = None
    employment_status: Optional[str] = None
    basic_salary: Optional[float] = None

class CustomerProfileResponse(BaseModel):
    id: int
    customer: Customer
    user: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User Profile Schemas
class UserProfileBase(BaseModel):
    account_number: str
    industry: str
    occupation: str
    organisation: str
    residence: str
    date_of_birth: str
    employment_status: EmploymentStatus
    basic_salary: float = Field(..., ge=0)
    expected_monthly_income: float = Field(..., ge=0)
    permanent_address_line1: str
    permanent_address_line2: Optional[str] = None
    permanent_address_line3: Optional[str] = None
    landmark: Optional[str] = None
    city: str
    post_code: str
    nationality: str
    marital_status: MaritalStatus

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Analytics Schemas
class CustomerSegmentResponse(BaseModel):
    name: str
    value: int

class ProductPerformanceResponse(BaseModel):
    name: str
    current: int
    previous: int
    period: str

class RegionalPerformanceResponse(BaseModel):
    region: str
    customers: int
    revenue: float
    growth: float
    period: str

class MonthlyTrendResponse(BaseModel):
    month: str
    year: int
    deposits: float
    withdrawals: float
    net_flow: float

class CustomerGrowthResponse(BaseModel):
    month: str
    year: int
    new_customers: int
    churned_customers: int
    net_growth: int

# New schemas for recommendations system
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class SegmentBase(BaseModel):
    name: str

class SegmentCreate(SegmentBase):
    pass

class Segment(SegmentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class RecommendationBase(BaseModel):
    product_id: int
    segment_id: int
    potential: str

class RecommendationCreate(RecommendationBase):
    pass

class Recommendation(RecommendationBase):
    id: int
    customer_count: Optional[int] = 0
    conversion_rate: Optional[float] = 0.0
    product: Optional[Product]
    segment: Optional[Segment]

    model_config = ConfigDict(from_attributes=True)

class RecommendationResponse(RecommendationBase):
    id: int
    product: Optional[Product]
    segment: Optional[Segment]
    customer_count: int
    conversion_rate: float

    model_config = ConfigDict(from_attributes=True)

class CampaignBase(BaseModel):
    product_id: int
    segment_id: int
    schedule_date: datetime
    notes: Optional[str] = None

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class SegmentOut(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]

    model_config = ConfigDict(from_attributes=True) 