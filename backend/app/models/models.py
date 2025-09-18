from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
from enum import Enum

# Enums
class EmploymentStatus(str, Enum):
    EMPLOYED = "EMPLOYED"
    UNEMPLOYED = "UNEMPLOYED"
    SELF_EMPLOYED = "SELF_EMPLOYED"
    STUDENT = "STUDENT"
    RETIRED = "RETIRED"

class MaritalStatus(str, Enum):
    SINGLE = "SINGLE"
    MARRIED = "MARRIED"
    DIVORCED = "DIVORCED"
    WIDOWED = "WIDOWED"

class EmploymentType(str, Enum):
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    CONTRACT = "CONTRACT"
    FREELANCE = "FREELANCE"

class MaritalStatusCSV(str, Enum):
    SINGLE = "SINGLE"
    MARRIED = "MARRIED"
    DIVORCED = "DIVORCED"
    WIDOWED = "WIDOWED"

class ResidenceStatus(str, Enum):
    OWNED = "OWNED"
    RENTED = "RENTED"
    MORTGAGED = "MORTGAGED"

class Nationality(str, Enum):
    OMANI = "OMANI"
    NON_OMANI = "NON_OMANI"

class Religion(str, Enum):
    MUSLIM = "MUSLIM"
    CHRISTIAN = "CHRISTIAN"
    HINDU = "HINDU"
    OTHER = "OTHER"

class AccountType(str, Enum):
    SAVINGS = "SAVINGS"
    CURRENT = "CURRENT"
    BUSINESS = "BUSINESS"

class YesNo(str, Enum):
    YES = "YES"
    NO = "NO"

class RiskTolerance(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class EducationLevel(str, Enum):
    HIGH_SCHOOL = "HIGH_SCHOOL"
    BACHELORS = "BACHELORS"
    MASTERS = "MASTERS"
    PHD = "PHD"

class Gender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class OccupationSector(str, Enum):
    IT = "IT"
    FINANCE = "FINANCE"
    HEALTHCARE = "HEALTHCARE"
    EDUCATION = "EDUCATION"
    OTHER = "OTHER"

class DigitalChannelPreference(str, Enum):
    MOBILE_APP = "MOBILE_APP"
    WEB = "WEB"
    BRANCH = "BRANCH"

# Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True)
    industry = Column(String)
    occupation = Column(String)
    organisation = Column(String)
    residence = Column(String)
    date_of_birth = Column(String)
    employment_status = Column(SQLEnum(EmploymentStatus))
    basic_salary = Column(Float)
    expected_monthly_income = Column(Float)
    permanent_address_line1 = Column(String)
    city = Column(String)
    post_code = Column(String)
    nationality = Column(String)
    marital_status = Column(SQLEnum(MaritalStatus))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    auth = relationship("Auth", back_populates="user", uselist=False)

class Auth(Base):
    __tablename__ = "auth"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="auth")

# Additional models
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    account = Column(String, nullable=False)
    segment = Column(String)
    status = Column(String)
    recommendation = Column(String)
    potential = Column(String)
    age = Column(Integer)
    income_omr = Column(Float)
    employment_type = Column(SQLEnum(EmploymentType))
    credit_score = Column(Integer)
    account_tenure_months = Column(Integer)
    marital_status_csv = Column(SQLEnum(MaritalStatusCSV))
    number_of_children = Column(Integer)
    digital_engagement_score = Column(Integer)
    residence_status = Column(SQLEnum(ResidenceStatus))
    nationality = Column(SQLEnum(Nationality))
    religion = Column(SQLEnum(Religion))
    account_type = Column(SQLEnum(AccountType))
    vehicle_owner = Column(SQLEnum(YesNo))
    drivers_license = Column(SQLEnum(YesNo))
    monthly_groceries_spend = Column(Float)
    international_travel_frequency = Column(Integer)
    risk_tolerance = Column(SQLEnum(RiskTolerance))
    student_status = Column(SQLEnum(YesNo))
    employer_insurance = Column(SQLEnum(YesNo))
    debt_to_income = Column(Float)
    business_account_owner = Column(SQLEnum(YesNo))
    already_has_products = Column(Integer)
    do_not_need_products = Column(Integer)
    recent_transactions = Column(Integer)
    education_level = Column(SQLEnum(EducationLevel))
    gender = Column(SQLEnum(Gender))
    occupation_sector = Column(SQLEnum(OccupationSector))
    health_score = Column(Integer)
    property_value_omr = Column(Float)
    vehicle_value_omr = Column(Float)
    credit_utilization_pct = Column(Float)
    avg_days_abroad_per_year = Column(Integer)
    digital_channel_preference = Column(SQLEnum(DigitalChannelPreference))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Segment(Base):
    __tablename__ = "segments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CustomerRecommendation(Base):
    __tablename__ = "customer_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    segment_id = Column(Integer, ForeignKey("segments.id"), nullable=False)
    status = Column(String, default="pending")
    recommendation_reason = Column(String)
    confidence_score = Column(Float)
    priority = Column(String)
    recommended_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    customer = relationship("Customer", backref="recommendations")
    product = relationship("Product", backref="recommendations")
    segment = relationship("Segment", backref="recommendations")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, nullable=False)
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TransactionType(str, Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

# Additional models for analytics and recommendations
class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    segment_id = Column(Integer, ForeignKey("segments.id"), nullable=False)
    potential = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    product = relationship("Product", backref="product_recommendations")
    segment = relationship("Segment", backref="segment_recommendations")

class CustomerSegment(Base):
    __tablename__ = "customer_segments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ProductPerformance(Base):
    __tablename__ = "product_performance"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    current = Column(Float)
    previous = Column(Float)
    period = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RegionalPerformance(Base):
    __tablename__ = "regional_performance"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    customers = Column(Integer)
    revenue = Column(Float)
    growth = Column(Float)
    period = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MonthlyTrend(Base):
    __tablename__ = "monthly_trends"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    deposits = Column(Float)
    withdrawals = Column(Float)
    net_flow = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CustomerGrowth(Base):
    __tablename__ = "customer_growth"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    new_customers = Column(Integer)
    churned_customers = Column(Integer)
    net_growth = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
