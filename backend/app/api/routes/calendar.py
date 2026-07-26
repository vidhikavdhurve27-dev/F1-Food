from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.event import CalendarEvent
from app.schemas.event import EventCreate, EventOut

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/events", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(CalendarEvent).order_by(CalendarEvent.start_time).all()


@router.post("/events", response_model=EventOut)
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    event = CalendarEvent(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
