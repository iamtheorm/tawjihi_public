from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DECIMAL, TIMESTAMP, Float, DateTime
from sqlalchemy.orm import relationship
from .database import Base

# ----------------- Existing Customer Model (Unchanged) -----------------

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

    # Add relationship to customer_recommendations
    customer_recommendations = relationship("CustomerRecommendation", back_populates="customer")


# ----------------- New Models for Product Recommendations -----------------

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
    potential = Column(String(10))  # validated at schema level

    product = relationship("Product", back_populates="recommendations")
    segment = relationship("Segment", back_populates="recommendations")




# ----------------- New CustomerRecommendation Model -----------------

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