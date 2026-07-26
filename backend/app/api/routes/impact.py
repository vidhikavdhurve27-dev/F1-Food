from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.partners import NGO
from app.models.rescue import Rescue, RescueStatus
from app.schemas.rescue import ImpactSummary

router = APIRouter(prefix="/impact", tags=["impact"])

# Rough constants used to translate meals -> waste/CO2, matching the figures
# shown on the public Impact dashboard (tune these once real data exists).
KG_FOOD_PER_MEAL = 0.35
KG_CO2_PER_MEAL = 0.6


@router.get("/summary", response_model=ImpactSummary)
def impact_summary(db: Session = Depends(get_db)):
    completed = db.query(Rescue).filter(Rescue.status == RescueStatus.COMPLETED)

    meals_saved = completed.with_entities(func.coalesce(func.sum(Rescue.meals_count), 0)).scalar()
    avg_eta = completed.with_entities(func.coalesce(func.avg(Rescue.eta_minutes), 0)).scalar()
    ngos_connected = db.query(func.count(NGO.id)).scalar()
    active_zones = db.query(func.count(func.distinct(NGO.zone))).scalar()

    return ImpactSummary(
        meals_saved=int(meals_saved),
        food_waste_reduced_kg=round(meals_saved * KG_FOOD_PER_MEAL, 1),
        co2_saved_kg=round(meals_saved * KG_CO2_PER_MEAL, 1),
        ngos_connected=int(ngos_connected),
        active_zones=int(active_zones or 0),
        avg_pickup_minutes=round(float(avg_eta), 1),
    )
