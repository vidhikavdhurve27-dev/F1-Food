from pydantic import BaseModel


class RestaurantOut(BaseModel):
    id: str
    name: str
    address: str | None
    lat: float | None
    lng: float | None
    cuisine_type: str | None

    class Config:
        from_attributes = True


class NGOOut(BaseModel):
    id: str
    name: str
    address: str | None
    lat: float | None
    lng: float | None
    daily_capacity_meals: int
    zone: str | None

    class Config:
        from_attributes = True
