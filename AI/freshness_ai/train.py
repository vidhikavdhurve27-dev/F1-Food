"""
Stage 2 — Freshness AI.

Generates a synthetic dataset standing in for real lab/sensor-verified
freshness data, then trains a small regression model that scores 0-1 safety
freshness and derives a recommended donation window from meal type,
hours since cooked, storage temperature, and ambient humidity.

Run from AI/freshness_ai/:
    python train.py
Outputs:
    ../../datasets/freshness_ai_synthetic.csv
    ../../models/freshness_ai.joblib
"""
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

HERE = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(HERE, "..", "..", "datasets")
MODELS_DIR = os.path.join(HERE, "..", "..", "models")
FOOD_CATEGORIES = ["dry_snacks", "rice_curry", "dairy_based", "fried_items", "baked_goods", "raw_salads"]

# Roughly how many hours each category stays safe at room temp before risk climbs sharply.
CATEGORY_BASE_SAFE_HOURS = {
    "dry_snacks": 10,
    "rice_curry": 3,
    "dairy_based": 2,
    "fried_items": 5,
    "baked_goods": 8,
    "raw_salads": 2.5,
}


def generate_synthetic_dataset(n_rows: int = 4000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    category = rng.choice(FOOD_CATEGORIES, n_rows)
    hours_since_cooked = rng.uniform(0, 10, n_rows)
    storage_temp_c = rng.normal(24, 6, n_rows).clip(4, 40)   # fridge (~4C) to hot kitchen (~40C)
    humidity_pct = rng.uniform(30, 90, n_rows)

    base_safe_hours = np.array([CATEGORY_BASE_SAFE_HOURS[c] for c in category])
    # Every 10C above 20C roughly halves safe time; refrigeration extends it.
    temp_factor = np.where(
        storage_temp_c <= 8, 2.5, 1.0 / (1 + np.maximum(storage_temp_c - 20, 0) / 10)
    )
    effective_safe_hours = base_safe_hours * temp_factor

    # Freshness decays as hours_since_cooked approaches/exceeds the effective safe window.
    ratio = hours_since_cooked / np.maximum(effective_safe_hours, 0.5)
    freshness_score = np.clip(1.0 - ratio, 0, 1)
    freshness_score -= (humidity_pct - 60).clip(min=0) * 0.001  # high humidity nudges risk up
    freshness_score = np.clip(freshness_score + rng.normal(0, 0.03, n_rows), 0, 1)

    return pd.DataFrame({
        "food_category": category,
        "hours_since_cooked": hours_since_cooked.round(2),
        "storage_temp_c": storage_temp_c.round(1),
        "humidity_pct": humidity_pct.round(1),
        "freshness_score": freshness_score.round(3),
    })


def train():
    os.makedirs(DATASETS_DIR, exist_ok=True)
    os.makedirs(MODELS_DIR, exist_ok=True)

    df = generate_synthetic_dataset()
    dataset_path = os.path.join(DATASETS_DIR, "freshness_ai_synthetic.csv")
    df.to_csv(dataset_path, index=False)

    X = df.drop(columns=["freshness_score"])
    y = df["freshness_score"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocess = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["food_category"]),
    ], remainder="passthrough")

    model = Pipeline([
        ("preprocess", preprocess),
        ("regressor", GradientBoostingRegressor(n_estimators=150, max_depth=3, random_state=42)),
    ])
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"Freshness AI MAE on held-out synthetic data: {mae:.3f} (score is 0-1)")

    model_path = os.path.join(MODELS_DIR, "freshness_ai.joblib")
    joblib.dump(model, model_path)
    print(f"Saved dataset -> {dataset_path}")
    print(f"Saved model   -> {model_path}")


if __name__ == "__main__":
    train()
