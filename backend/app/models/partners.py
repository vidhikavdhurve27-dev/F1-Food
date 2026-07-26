import uuid

from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    phone = Column(String, nullable=True)
    cuisine_type = Column(String, nullable=True)

    user = relationship("User", back_populates="restaurant")
    listings = relationship("SurplusListing", back_populates="restaurant")


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    phone = Column(String, nullable=True)
    daily_capacity_meals = Column(Integer, default=100)
    zone = Column(String, nullable=True)

    user = relationship("User", back_populates="ngo")
    rescues = relationship("Rescue", back_populates="ngo")
