from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# ----------------- Customer Schemas -----------------

class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    account: str
    segment: Optional[str]
    status: Optional[str]
    recommendation: Optional[str]
    potential: Optional[str]

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- Product Schemas -----------------

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ----------------- Segment Schemas -----------------

class SegmentBase(BaseModel):
    name: str

class SegmentCreate(SegmentBase):
    pass

class Segment(SegmentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ----------------- Recommendation Schemas -----------------

class RecommendationBase(BaseModel):
    product_id: int
    segment_id: int
    potential: str  # 'low', 'medium', 'high'

class RecommendationCreate(RecommendationBase):
    pass

class Recommendation(RecommendationBase):
    id: int
    customer_count: Optional[int] = 0
    conversion_rate: Optional[float] = 0.0
    product: Optional[Product]
    segment: Optional[Segment]

    model_config = ConfigDict(from_attributes=True)

# ✅ Response schema for API output with computed values
class RecommendationResponse(RecommendationBase):
    id: int
    product: Optional[Product]
    segment: Optional[Segment]
    customer_count: int
    conversion_rate: float

    model_config = ConfigDict(from_attributes=True)

# ----------------- Campaign Schemas -----------------

class CampaignBase(BaseModel):
    recommendation_id: int
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = 'pending'

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
    
class CampaignCreate(BaseModel):
    product_id: int
    segment_id: int
    schedule_date: datetime
    notes: Optional[str] = None

# ✅ Public schema to return segments
class SegmentOut(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

# ✅ Public schema to return products
class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]

    model_config = ConfigDict(from_attributes=True)
