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