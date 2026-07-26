import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Text

from app.core.database import Base


class CalendarEvent(Base):
    """Community/rescue events shown on the Event Calendar page (drives, pickups, campaigns)."""

    __tablename__ = "calendar_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String, nullable=True)  # e.g. "pickup", "drive", "campaign"
    location = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
