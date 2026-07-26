from datetime import datetime

from pydantic import BaseModel

from app.models.rescue import ListingStatus, RescueStatus


class ListingCreate(BaseModel):
    photo_url: str | None = None
    manual_meal_count: int | None = None   # optional override if no photo/CV used


class ListingConfirm(BaseModel):
    confirmed_meal_count: int


class ListingOut(BaseModel):
    id: str
    restaurant_id: str
    photo_url: str | None
    predicted_meal_count: int | None
    confirmed_meal_count: int | None
    freshness_score: float | None
    donation_window_start: datetime | None
    donation_window_end: datetime | None
    status: ListingStatus
    created_at: datetime

    class Config:
        from_attributes = True


class RescueOut(BaseModel):
    id: str
    listing_id: str
    ngo_id: str
    meals_count: int
    route_distance_km: float | None
    eta_minutes: int | None
    pickup_time: datetime | None
    status: RescueStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ImpactSummary(BaseModel):
    meals_saved: int
    food_waste_reduced_kg: float
    co2_saved_kg: float
    ngos_connected: int
    active_zones: int
    avg_pickup_minutes: float
