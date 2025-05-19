from sqlalchemy import Column, Integer, String
from .database import Base

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
