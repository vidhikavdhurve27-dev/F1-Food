from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.core.database import get_db
from app.models.partners import NGO
from app.models.rescue import ListingStatus, Rescue, RescueStatus
from app.models.user import User, UserRole
from app.schemas.rescue import RescueOut

router = APIRouter(prefix="/ngos", tags=["ngos"])


def _get_own_ngo(user: User, db: Session) -> NGO:
    ngo = db.query(NGO).filter(NGO.user_id == user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")
    return ngo


@router.get("/rescues", response_model=list[RescueOut])
def list_rescues(
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.NGO)),
):
    """All rescues proposed to or accepted by this NGO."""
    ngo = _get_own_ngo(user, db)
    return db.query(Rescue).filter(Rescue.ngo_id == ngo.id).all()


@router.post("/rescues/{rescue_id}/confirm", response_model=RescueOut)
def confirm_rescue(
    rescue_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.NGO)),
):
    ngo = _get_own_ngo(user, db)
    rescue = db.query(Rescue).filter(Rescue.id == rescue_id, Rescue.ngo_id == ngo.id).first()
    if not rescue:
        raise HTTPException(status_code=404, detail="Rescue not found")

    rescue.status = RescueStatus.CONFIRMED
    db.commit()
    db.refresh(rescue)
    return rescue


@router.post("/rescues/{rescue_id}/complete", response_model=RescueOut)
def complete_rescue(
    rescue_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.NGO)),
):
    ngo = _get_own_ngo(user, db)
    rescue = db.query(Rescue).filter(Rescue.id == rescue_id, Rescue.ngo_id == ngo.id).first()
    if not rescue:
        raise HTTPException(status_code=404, detail="Rescue not found")

    rescue.status = RescueStatus.COMPLETED
    rescue.completed_at = datetime.now(timezone.utc)
    rescue.listing.status = ListingStatus.PICKED_UP
    db.commit()
    db.refresh(rescue)
    return rescue
