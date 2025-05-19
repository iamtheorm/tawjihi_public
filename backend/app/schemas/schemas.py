from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.models import EmploymentStatus, MaritalStatus

# Auth Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# User Profile Schemas
class UserProfileBase(BaseModel):
    account_number: str
    industry: str
    occupation: str
    organisation: str
    residence: str
    date_of_birth: datetime
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

class UserProfileUpdate(BaseModel):
    account_number: Optional[str] = None
    industry: Optional[str] = None
    occupation: Optional[str] = None
    organisation: Optional[str] = None
    residence: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    employment_status: Optional[EmploymentStatus] = None
    basic_salary: Optional[float] = Field(None, ge=0)
    expected_monthly_income: Optional[float] = Field(None, ge=0)
    permanent_address_line1: Optional[str] = None
    permanent_address_line2: Optional[str] = None
    permanent_address_line3: Optional[str] = None
    landmark: Optional[str] = None
    city: Optional[str] = None
    post_code: Optional[str] = None
    nationality: Optional[str] = None
    marital_status: Optional[MaritalStatus] = None

class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 