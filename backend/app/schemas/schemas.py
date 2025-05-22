from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.models import EmploymentStatus, MaritalStatus
from enum import Enum

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

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
    transaction_type: TransactionType
    amount: float
    description: str
    transaction_date: datetime

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

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

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