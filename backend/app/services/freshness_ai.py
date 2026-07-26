"""
Stage 2 — Freshness AI.

Loads the trained model from models/freshness_ai.joblib (see
AI/freshness_ai/train.py). Falls back to a simple heuristic if the model
file isn't present yet, so the API keeps working either way.
"""
import os
import random
from datetime import datetime, timedelta, timezone

import pandas as pd

from app.core.config import get_settings

settings = get_settings()

_MODEL = None
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models", "freshness_ai.joblib")

# Coarse mapping from restaurant cuisine_type to the food_category buckets
# the model was trained on. Extend as real menu data comes in.
_CUISINE_TO_CATEGORY = {
    "North Indian": "rice_curry",
    "South Indian": "rice_curry",
    "Chinese": "fried_items",
    "Continental": "baked_goods",
    "Bakery": "baked_goods",
    "Street Food": "fried_items",
}


def _load_model():
    global _MODEL
    if _MODEL is None and os.path.exists(_MODEL_PATH):
        import joblib
        _MODEL = joblib.load(_MODEL_PATH)
    return _MODEL


def score_freshness(
    meal_count: int,
    cuisine_type: str | None = None,
    hours_since_cooked: float = 0.5,
    storage_temp_c: float = 24.0,
    humidity_pct: float = 55.0,
) -> tuple[float, datetime, datetime]:
    """Return (freshness_score 0-1, donation_window_start, donation_window_end)."""
    now = datetime.now(timezone.utc)
    model = _load_model()

    if model is not None:
        category = _CUISINE_TO_CATEGORY.get(cuisine_type, "rice_curry")
        row = pd.DataFrame([{
            "food_category": category,
            "hours_since_cooked": hours_since_cooked,
            "storage_temp_c": storage_temp_c,
            "humidity_pct": humidity_pct,
        }])
        score = float(max(0.0, min(1.0, model.predict(row)[0])))
        # Higher freshness -> longer safe donation window; scales the configured default.
        window_minutes = int(settings.DEFAULT_DONATION_WINDOW_MIN * (0.5 + score))
        return round(score, 2), now, now + timedelta(minutes=window_minutes)

    # Fallback heuristic if the trained model isn't present.
    score = round(random.uniform(0.6, 0.98), 2)
    window_minutes = settings.DEFAULT_DONATION_WINDOW_MIN + min(meal_count, 60)
    return score, now, now + timedelta(minutes=window_minutes)
