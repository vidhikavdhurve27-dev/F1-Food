import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship

from app.core.database import Base


class ListingStatus(str, enum.Enum):
    PENDING = "pending"          # awaiting AI scoring
    CONFIRMED = "confirmed"      # restaurant confirmed final count
    MATCHED = "matched"          # matched to an NGO
    PICKED_UP = "picked_up"
    EXPIRED = "expired"


class RescueStatus(str, enum.Enum):
    PROPOSED = "proposed"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class SurplusListing(Base):
    """A single surplus-food event logged by a restaurant."""

    __tablename__ = "surplus_listings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False)

    photo_url = Column(String, nullable=True)
    predicted_meal_count = Column(Integer, nullable=True)   # from Computer Vision stage
    confirmed_meal_count = Column(Integer, nullable=True)   # restaurant's final confirmed count
    freshness_score = Column(Float, nullable=True)          # 0-1, from Freshness AI stage
    donation_window_start = Column(DateTime, nullable=True)
    donation_window_end = Column(DateTime, nullable=True)

    status = Column(Enum(ListingStatus), default=ListingStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    restaurant = relationship("Restaurant", back_populates="listings")
    rescue = relationship("Rescue", back_populates="listing", uselist=False)


class Rescue(Base):
    """A confirmed match between a surplus listing and an NGO, including routing info."""

    __tablename__ = "rescues"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    listing_id = Column(String, ForeignKey("surplus_listings.id"), unique=True, nullable=False)
    ngo_id = Column(String, ForeignKey("ngos.id"), nullable=False)

    meals_count = Column(Integer, nullable=False)
    route_distance_km = Column(Float, nullable=True)
    eta_minutes = Column(Integer, nullable=True)
    pickup_time = Column(DateTime, nullable=True)

    status = Column(Enum(RescueStatus), default=RescueStatus.PROPOSED)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    listing = relationship("SurplusListing", back_populates="rescue")
    ngo = relationship("NGO", back_populates="rescues")
