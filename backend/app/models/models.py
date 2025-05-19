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