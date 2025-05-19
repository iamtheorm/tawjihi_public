from pydantic import BaseModel, EmailStr
from typing import Optional

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
