"""
Stage 3 — Surplus Prediction.

Loads the trained model from models/surplus_prediction.joblib (see
AI/surplus_prediction/train.py). Falls back to a simple heuristic if the
model file isn't present yet, so the API keeps working either way.
"""
import os
import random

import pandas as pd

_MODEL = None
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models", "surplus_prediction.joblib")


def _load_model():
    global _MODEL
    if _MODEL is None and os.path.exists(_MODEL_PATH):
        import joblib
        _MODEL = joblib.load(_MODEL_PATH)
    return _MODEL


def predict_surplus(
    restaurant_id: str,
    day_of_week: int,
    weather: str = "clear",
    cuisine_type: str = "North Indian",
    avg_daily_sales: float = 120.0,
    local_event: int = 0,
) -> int:
    """Forecast expected leftover meal count for a restaurant on a given day."""
    model = _load_model()
    if model is not None:
        row = pd.DataFrame([{
            "day_of_week": day_of_week,
            "weather": weather,
            "cuisine_type": cuisine_type,
            "avg_daily_sales": avg_daily_sales,
            "local_event": local_event,
        }])
        return max(int(round(model.predict(row)[0])), 0)

    # Fallback heuristic if the trained model isn't present.
    base = random.randint(5, 30)
    if day_of_week in (5, 6):
        base += 10
    if weather in ("rain", "storm"):
        base += 5
    return base
