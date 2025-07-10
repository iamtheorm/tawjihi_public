from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DECIMAL, TIMESTAMP, Float, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base
from sqlalchemy.sql import func

class TransactionType(str, enum.Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

class EmploymentStatus(str, enum.Enum):
    EMPLOYED = "EMPLOYED"
    UNEMPLOYED = "UNEMPLOYED"
    SELF_EMPLOYED = "SELF_EMPLOYED"

class MaritalStatus(str, enum.Enum):
    SINGLE = "SINGLE"
    MARRIED = "MARRIED"
    DIVORCED = "DIVORCED"
    WIDOWED = "WIDOWED"

# New Enums for CSV fields
class EmploymentType(str, enum.Enum):
    RETIRED = "Retired"
    SALARIED = "Salaried"
    SELF_EMPLOYED = "Self-Employed"
    STUDENT = "Student"

class MaritalStatusCSV(str, enum.Enum):
    DIVORCED = "Divorced"
    MARRIED = "Married"
    SINGLE = "Single"
    WIDOWED = "Widowed"

class ResidenceStatus(str, enum.Enum):
    FAMILY = "Family"
    OWNED = "Owned"
    RENTED = "Rented"

class Nationality(str, enum.Enum):
    BD = "BD"
    EG = "EG"
    IN = "IN"
    OM = "OM"
    OTHER = "Other"
    PH = "PH"
    PK = "PK"
    UK = "UK"
    US = "US"

class Religion(str, enum.Enum):
    CHRISTIAN = "Christian"
    HINDU = "Hindu"
    MUSLIM = "Muslim"
    OTHER = "Other"

class AccountType(str, enum.Enum):
    BUSINESS = "Business"
    JOINT = "Joint"
    SALARY = "Salary"
    SAVINGS = "Savings"

class YesNo(str, enum.Enum):
    YES = "Yes"
    NO = "No"

class RiskTolerance(str, enum.Enum):
    HIGH = "High"
    LOW = "Low"
    MEDIUM = "Medium"

class EducationLevel(str, enum.Enum):
    ASSOCIATE = "Associate"
    BACHELOR = "Bachelor"
    DOCTORATE = "Doctorate"
    HIGH_SCHOOL = "High School"
    MASTER = "Master"

class Gender(str, enum.Enum):
    FEMALE = "Female"
    MALE = "Male"
    OTHER = "Other"

class OccupationSector(str, enum.Enum):
    GOVERNMENT = "Government"
    PRIVATE = "Private"
    RETIRED = "Retired"
    SELF_EMPLOYED = "Self-Employed"
    STUDENT = "Student"

class DigitalChannelPreference(str, enum.Enum):
    BRANCH = "Branch"
    MOBILE = "Mobile"
    WEB = "Web"

class Auth(Base):
    __tablename__ = "auth"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Customer Models
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    account = Column(String, nullable=False)
    segment = Column(String, nullable=True)
    status = Column(String, nullable=True)
    recommendation = Column(String, nullable=True)
    potential = Column(String, nullable=True)
    
    # Additional CSV fields
    age = Column(Integer, nullable=True)
    income_omr = Column(Float, nullable=True)
    employment_type = Column(Enum(EmploymentType), nullable=True)
    credit_score = Column(Integer, nullable=True)
    account_tenure_months = Column(Integer, nullable=True)
    marital_status_csv = Column(Enum(MaritalStatusCSV), nullable=True)
    number_of_children = Column(Integer, nullable=True)
    digital_engagement_score = Column(Integer, nullable=True)
    residence_status = Column(Enum(ResidenceStatus), nullable=True)
    nationality = Column(Enum(Nationality), nullable=True)
    religion = Column(Enum(Religion), nullable=True)
    account_type = Column(Enum(AccountType), nullable=True)
    vehicle_owner = Column(Enum(YesNo), nullable=True)
    drivers_license = Column(Enum(YesNo), nullable=True)
    monthly_groceries_spend = Column(Float, nullable=True)
    international_travel_frequency = Column(Integer, nullable=True)
    risk_tolerance = Column(Enum(RiskTolerance), nullable=True)
    student_status = Column(Enum(YesNo), nullable=True)
    employer_insurance = Column(Enum(YesNo), nullable=True)
    debt_to_income = Column(Float, nullable=True)
    business_account_owner = Column(Enum(YesNo), nullable=True)
    already_has_products = Column(Integer, nullable=True)
    do_not_need_products = Column(Integer, nullable=True)
    recent_transactions = Column(Integer, nullable=True)
    education_level = Column(Enum(EducationLevel), nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    occupation_sector = Column(Enum(OccupationSector), nullable=True)
    health_score = Column(Integer, nullable=True)
    property_value_omr = Column(Float, nullable=True)
    vehicle_value_omr = Column(Float, nullable=True)
    credit_utilization_pct = Column(Float, nullable=True)
    avg_days_abroad_per_year = Column(Integer, nullable=True)
    digital_channel_preference = Column(Enum(DigitalChannelPreference), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer_recommendations = relationship("CustomerRecommendation", back_populates="customer")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True)
    industry = Column(String)
    occupation = Column(String)
    organisation = Column(String)
    residence = Column(String)
    date_of_birth = Column(String)
    employment_status = Column(Enum(EmploymentStatus))
    basic_salary = Column(Float)
    expected_monthly_income = Column(Float)
    permanent_address_line1 = Column(String)
    city = Column(String)
    post_code = Column(String)
    nationality = Column(String)
    marital_status = Column(Enum(MaritalStatus))

    transactions = relationship("Transaction", back_populates="user")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, ForeignKey("users.account_number"))
    transaction_type = Column(String)
    amount = Column(Float)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")

# Recommendation Models
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)

    recommendations = relationship("Recommendation", back_populates="product")
    customer_recommendations = relationship("CustomerRecommendation", back_populates="product")

class Segment(Base):
    __tablename__ = "segments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    recommendations = relationship("Recommendation", back_populates="segment")
    customer_recommendations = relationship("CustomerRecommendation", back_populates="segment")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    segment_id = Column(Integer, ForeignKey("segments.id"))
    customer_count = Column(Integer, default=0)
    conversion_rate = Column(Float, default=0.0)
    potential = Column(String(10))

    product = relationship("Product", back_populates="recommendations")
    segment = relationship("Segment", back_populates="recommendations")

class CustomerRecommendation(Base):
    __tablename__ = "customer_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    segment_id = Column(Integer, ForeignKey("segments.id"), nullable=False)
    recommendation_reason = Column(String, nullable=True)
    status = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    priority = Column(String, nullable=True)
    recommended_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="customer_recommendations")
    product = relationship("Product", back_populates="customer_recommendations")
    segment = relationship("Segment", back_populates="customer_recommendations")

# Analytics Models
class CustomerSegment(Base):
    __tablename__ = "customer_segments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(Integer, nullable=False)

class ProductPerformance(Base):
    __tablename__ = "product_performance"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    current = Column(Float, nullable=False)
    previous = Column(Float, nullable=False)
    period = Column(String, nullable=False)

class RegionalPerformance(Base):
    __tablename__ = "regional_performance"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    customers = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    growth = Column(Float, nullable=False)
    period = Column(String, nullable=False)

class MonthlyTrend(Base):
    __tablename__ = "monthly_trends"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    deposits = Column(Float, nullable=False)
    withdrawals = Column(Float, nullable=False)
    net_flow = Column(Float, nullable=False)

class CustomerGrowth(Base):
    __tablename__ = "customer_growth"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    new_customers = Column(Integer, nullable=False)
    churned_customers = Column(Integer, nullable=False)
    net_growth = Column(Integer, nullable=False)