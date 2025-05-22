from sqlalchemy import Boolean, Column, ForeignKey, String, DateTime, Date, Numeric, Enum, Text, Integer, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.database import Base

class EmploymentStatus(enum.Enum):
    EMPLOYED = "employed"
    UNEMPLOYED = "unemployed"
    SELF_EMPLOYED = "self_employed"

class MaritalStatus(enum.Enum):
    SINGLE = "single"
    MARRIED = "married"
    DIVORCED = "divorced"
    WIDOWED = "widowed"

class TransactionType(enum.Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

# User model
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
    permanent_address_line2 = Column(String, nullable=True)
    permanent_address_line3 = Column(String, nullable=True)
    landmark = Column(String, nullable=True)
    city = Column(String)
    post_code = Column(String)
    nationality = Column(String)
    marital_status = Column(Enum(MaritalStatus))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    # Relationships
    auth = relationship("Auth", back_populates="user", uselist=False)
    transactions = relationship("Transaction", back_populates="user")

# Auth model
class Auth(Base):
    __tablename__ = "auth"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationship
    user = relationship("User", back_populates="auth")

# Transaction model
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(20), ForeignKey("users.account_number"), nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    description = Column(Text)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Metadata columns
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="transactions")

# Analytics Models
class CustomerSegment(Base):
    __tablename__ = "customer_segments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ProductPerformance(Base):
    __tablename__ = "product_performance"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    current = Column(Integer, nullable=False)
    previous = Column(Integer, nullable=False)
    period = Column(String, nullable=False)  # e.g., "2023-Q2"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RegionalPerformance(Base):
    __tablename__ = "regional_performance"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    customers = Column(Integer, nullable=False)
    revenue = Column(Numeric(12, 2), nullable=False)
    growth = Column(Float, nullable=False)
    period = Column(String, nullable=False)  # e.g., "2023-Q2"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MonthlyTrend(Base):
    __tablename__ = "monthly_trends"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    deposits = Column(Numeric(12, 2), nullable=False)
    withdrawals = Column(Numeric(12, 2), nullable=False)
    net_flow = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CustomerGrowth(Base):
    __tablename__ = "customer_growth"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    new_customers = Column(Integer, nullable=False)
    churned_customers = Column(Integer, nullable=False)
    net_growth = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True, onupdate=func.now(), default=func.now())

    # Add relationship to customer_recommendations
    customer_recommendations = relationship("CustomerRecommendation", back_populates="customer")

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
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="customer_recommendations")
    product = relationship("Product", back_populates="customer_recommendations")
    segment = relationship("Segment", back_populates="customer_recommendations")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    segment_id = Column(Integer, ForeignKey("segments.id"))
    schedule_date = Column(DateTime)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")
    segment = relationship("Segment")