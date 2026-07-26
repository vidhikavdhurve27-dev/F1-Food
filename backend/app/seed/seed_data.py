"""
Generates synthetic restaurants, NGOs, listings, rescues, and calendar events
so the API and frontend have realistic data to run against before real
partners/datasets exist.

Run from backend/ with:  python -m app.seed.seed_data
"""
import random
from datetime import datetime, timedelta, timezone

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.event import CalendarEvent
from app.models.partners import NGO, Restaurant
from app.models.rescue import ListingStatus, Rescue, RescueStatus, SurplusListing
from app.models.user import User, UserRole

random.seed(42)

ZONES = ["Andheri", "Bandra", "Dadar", "Powai", "Kurla", "Chembur"]
CUISINES = ["North Indian", "South Indian", "Chinese", "Continental", "Bakery", "Street Food"]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(Restaurant).count() > 0:
            print("Data already seeded — skipping.")
            return

        # 42 partner restaurant kitchens, matching the Impact dashboard's showcase figure
        restaurants = []
        for i in range(42):
            user = User(
                email=f"restaurant{i}@f1food.demo",
                hashed_password=hash_password("demo1234"),
                role=UserRole.RESTAURANT,
            )
            db.add(user)
            db.flush()
            r = Restaurant(
                user_id=user.id,
                name=f"Kitchen #{i+1}",
                address=f"{random.choice(ZONES)}, Mumbai",
                lat=19.0 + random.uniform(-0.15, 0.15),
                lng=72.85 + random.uniform(-0.15, 0.15),
                cuisine_type=random.choice(CUISINES),
            )
            db.add(r)
            restaurants.append(r)
        db.flush()

        # 18 NGOs across 6 zones
        ngos = []
        for i in range(18):
            user = User(
                email=f"ngo{i}@f1food.demo",
                hashed_password=hash_password("demo1234"),
                role=UserRole.NGO,
            )
            db.add(user)
            db.flush()
            n = NGO(
                user_id=user.id,
                name=f"Community Kitchen NGO {i+1}",
                address=f"{ZONES[i % len(ZONES)]}, Mumbai",
                lat=19.0 + random.uniform(-0.15, 0.15),
                lng=72.85 + random.uniform(-0.15, 0.15),
                daily_capacity_meals=random.randint(30, 150),
                zone=ZONES[i % len(ZONES)],
            )
            db.add(n)
            ngos.append(n)
        db.flush()

        # Completed rescues totalling ~520 meals saved at ~12 min average pickup
        total_meals_target = 520
        remaining = total_meals_target
        now = datetime.now(timezone.utc)

        while remaining > 0:
            restaurant = random.choice(restaurants)
            ngo = random.choice(ngos)
            meals = min(remaining, random.randint(8, 35))
            remaining -= meals

            created_at = now - timedelta(days=random.randint(0, 45))
            listing = SurplusListing(
                restaurant_id=restaurant.id,
                photo_url=None,
                predicted_meal_count=meals,
                confirmed_meal_count=meals,
                freshness_score=round(random.uniform(0.7, 0.99), 2),
                donation_window_start=created_at,
                donation_window_end=created_at + timedelta(hours=2),
                status=ListingStatus.PICKED_UP,
                created_at=created_at,
            )
            db.add(listing)
            db.flush()

            eta = random.randint(6, 20)
            rescue = Rescue(
                listing_id=listing.id,
                ngo_id=ngo.id,
                meals_count=meals,
                route_distance_km=round(random.uniform(0.8, 6.5), 2),
                eta_minutes=eta,
                pickup_time=created_at + timedelta(minutes=eta),
                status=RescueStatus.COMPLETED,
                created_at=created_at,
                completed_at=created_at + timedelta(minutes=eta + random.randint(5, 15)),
            )
            db.add(rescue)

        # A handful of upcoming calendar events
        event_defs = [
            ("Weekend Surplus Drive", "drive", 2),
            ("NGO Onboarding Session", "campaign", 5),
            ("Bandra Kitchens Pickup Day", "pickup", 8),
        ]
        for title, etype, days_out in event_defs:
            start = now + timedelta(days=days_out, hours=10)
            db.add(CalendarEvent(
                title=title,
                description=f"{title} — coordinated across partner kitchens and NGOs.",
                event_type=etype,
                location=random.choice(ZONES) + ", Mumbai",
                start_time=start,
                end_time=start + timedelta(hours=3),
            ))

        db.commit()
        print(f"Seeded {len(restaurants)} restaurants, {len(ngos)} NGOs, "
              f"~{total_meals_target} meals across completed rescues, and 3 calendar events.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
