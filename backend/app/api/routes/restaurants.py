from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.core.database import get_db
from app.models.partners import NGO, Restaurant
from app.models.rescue import ListingStatus, Rescue, RescueStatus, SurplusListing
from app.models.user import User, UserRole
from app.schemas.rescue import ListingConfirm, ListingCreate, ListingOut, RescueOut
from app.services.cv_meal_count import estimate_meal_count
from app.services.freshness_ai import score_freshness
from app.services.routing import rank_ngos

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


def _get_own_restaurant(user: User, db: Session) -> Restaurant:
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")
    return restaurant


@router.post("/listings", response_model=ListingOut)
def create_listing(
    payload: ListingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.RESTAURANT)),
):
    """Log a kitchen's surplus: runs Stage 1 (CV count) + Stage 2 (freshness) automatically."""
    restaurant = _get_own_restaurant(user, db)

    predicted_count = payload.manual_meal_count or estimate_meal_count(payload.photo_url)
    freshness_score, window_start, window_end = score_freshness(predicted_count, restaurant.cuisine_type)

    listing = SurplusListing(
        restaurant_id=restaurant.id,
        photo_url=payload.photo_url,
        predicted_meal_count=predicted_count,
        freshness_score=freshness_score,
        donation_window_start=window_start,
        donation_window_end=window_end,
        status=ListingStatus.PENDING,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.post("/listings/{listing_id}/confirm", response_model=RescueOut)
def confirm_listing(
    listing_id: str,
    payload: ListingConfirm,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.RESTAURANT)),
):
    """Restaurant confirms the final count. Triggers Stage 4 (NGO ranking + routing).

    Nothing is dispatched to an NGO until this confirmation happens.
    """
    restaurant = _get_own_restaurant(user, db)
    listing = db.query(SurplusListing).filter(
        SurplusListing.id == listing_id, SurplusListing.restaurant_id == restaurant.id
    ).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing.confirmed_meal_count = payload.confirmed_meal_count
    listing.status = ListingStatus.CONFIRMED

    ngos = db.query(NGO).all()
    ranked = rank_ngos(restaurant, ngos, payload.confirmed_meal_count)
    if not ranked:
        db.commit()
        raise HTTPException(status_code=409, detail="No NGO currently has capacity for this many meals")

    best_ngo, distance_km, eta_minutes = ranked[0]
    rescue = Rescue(
        listing_id=listing.id,
        ngo_id=best_ngo.id,
        meals_count=payload.confirmed_meal_count,
        route_distance_km=distance_km,
        eta_minutes=eta_minutes,
        pickup_time=datetime.utcnow(),
        status=RescueStatus.PROPOSED,
    )
    listing.status = ListingStatus.MATCHED
    db.add(rescue)
    db.commit()
    db.refresh(rescue)
    return rescue


@router.get("/listings", response_model=list[ListingOut])
def list_own_listings(
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.RESTAURANT)),
):
    restaurant = _get_own_restaurant(user, db)
    return db.query(SurplusListing).filter(SurplusListing.restaurant_id == restaurant.id).all()
