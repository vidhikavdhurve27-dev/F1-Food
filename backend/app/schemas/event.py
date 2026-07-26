from datetime import datetime

from pydantic import BaseModel


class EventCreate(BaseModel):
    title: str
    description: str | None = None
    event_type: str | None = None
    location: str | None = None
    start_time: datetime
    end_time: datetime | None = None


class EventOut(EventCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
