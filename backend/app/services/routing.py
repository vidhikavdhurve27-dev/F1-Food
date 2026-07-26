"""
Stage 4 — Rescue Routing.

Distance/ETA is computed algorithmically (haversine + a traffic multiplier).
NGO ranking additionally uses the trained acceptance-likelihood model from
models/routing_acceptance.joblib (see AI/routing/train.py) as a tie-breaker
on top of raw distance, when the model file is present.
"""
import math
import os

from app.models.partners import NGO, Restaurant

_MODEL = None
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models", "routing_acceptance.joblib")


def _load_model():
    global _MODEL
    if _MODEL is None and os.path.exists(_MODEL_PATH):
        import joblib
        _MODEL = joblib.load(_MODEL_PATH)
    return _MODEL


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def rank_ngos(restaurant: Restaurant, ngos: list[NGO], meal_count: int) -> list[tuple[NGO, float, int]]:
    """Return NGOs ranked best-first as (ngo, distance_km, eta_minutes).

    Filters out NGOs without spare capacity, then ranks by predicted
    acceptance likelihood (if the trained model is available) with distance
    as the primary tie-breaker; otherwise ranks by distance alone.
    """
    model = _load_model()
    candidates = []

    for ngo in ngos:
        if not (restaurant.lat and restaurant.lng and ngo.lat and ngo.lng):
            distance_km = 5.0  # fallback when coordinates are missing
        else:
            distance_km = _haversine_km(restaurant.lat, restaurant.lng, ngo.lat, ngo.lng)
        if ngo.daily_capacity_meals < meal_count:
            continue
        eta_minutes = max(5, int(distance_km * 2.5))  # rough city-traffic estimate

        spare_capacity_ratio = min(1.0, (ngo.daily_capacity_meals - meal_count) / ngo.daily_capacity_meals)
        candidates.append((ngo, round(distance_km, 2), eta_minutes, spare_capacity_ratio))

    if model is not None and candidates:
        import pandas as pd
        rows = pd.DataFrame([{
            "distance_km": c[1],
            "eta_minutes": c[2],
            "spare_capacity_ratio": c[3],
            "ngo_acceptance_track_record": 0.85,  # placeholder until real NGO history is tracked
        } for c in candidates])
        accept_probs = model.predict_proba(rows)[:, 1]
        ranked = sorted(zip(candidates, accept_probs), key=lambda t: (-t[1], t[0][1]))
        return [(c[0], c[1], c[2]) for c, _ in ranked]

    ranked = sorted(candidates, key=lambda t: (t[1], -t[0].daily_capacity_meals))
    return [(c[0], c[1], c[2]) for c in ranked]
