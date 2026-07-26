"""
Stage 3 — Surplus Prediction.

Generates a synthetic dataset standing in for real POS/sales history (until
real restaurant data is connected), then trains a small regression model
that forecasts expected leftover meal count from day-of-week, weather,
recent average sales, and whether a local event is happening.

Run from AI/surplus_prediction/:
    python train.py
Outputs:
    ../../datasets/surplus_prediction_synthetic.csv
    ../../models/surplus_prediction.joblib
"""
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

HERE = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(HERE, "..", "..", "datasets")
MODELS_DIR = os.path.join(HERE, "..", "..", "models")
WEATHER_OPTIONS = ["clear", "cloudy", "rain", "storm"]
CUISINES = ["North Indian", "South Indian", "Chinese", "Continental", "Bakery", "Street Food"]


def generate_synthetic_dataset(n_rows: int = 4000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    day_of_week = rng.integers(0, 7, n_rows)          # 0=Mon ... 6=Sun
    weather = rng.choice(WEATHER_OPTIONS, n_rows, p=[0.55, 0.25, 0.15, 0.05])
    cuisine = rng.choice(CUISINES, n_rows)
    avg_daily_sales = rng.normal(120, 40, n_rows).clip(20, 400)
    local_event = rng.integers(0, 2, n_rows)          # 0/1 flag: festival/match day nearby

    # Ground-truth generating function (what the model has to learn back).
    base = avg_daily_sales * 0.18
    weekend_bonus = np.where(np.isin(day_of_week, [5, 6]), 6, 0)
    weather_bonus = np.select(
        [weather == "rain", weather == "storm"], [4, 8], default=0
    )
    event_bonus = local_event * 10
    noise = rng.normal(0, 4, n_rows)

    surplus_meals = (base + weekend_bonus + weather_bonus + event_bonus + noise).clip(0)

    return pd.DataFrame({
        "day_of_week": day_of_week,
        "weather": weather,
        "cuisine_type": cuisine,
        "avg_daily_sales": avg_daily_sales.round(1),
        "local_event": local_event,
        "surplus_meals": surplus_meals.round().astype(int),
    })


def train():
    os.makedirs(DATASETS_DIR, exist_ok=True)
    os.makedirs(MODELS_DIR, exist_ok=True)

    df = generate_synthetic_dataset()
    dataset_path = os.path.join(DATASETS_DIR, "surplus_prediction_synthetic.csv")
    df.to_csv(dataset_path, index=False)

    X = df.drop(columns=["surplus_meals"])
    y = df["surplus_meals"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    categorical = ["weather", "cuisine_type"]
    numeric = ["day_of_week", "avg_daily_sales", "local_event"]

    preprocess = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ], remainder="passthrough")

    model = Pipeline([
        ("preprocess", preprocess),
        ("regressor", RandomForestRegressor(n_estimators=200, max_depth=8, random_state=42)),
    ])
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"Surplus prediction MAE on held-out synthetic data: {mae:.2f} meals")

    model_path = os.path.join(MODELS_DIR, "surplus_prediction.joblib")
    joblib.dump(model, model_path)
    print(f"Saved dataset -> {dataset_path}")
    print(f"Saved model   -> {model_path}")


if __name__ == "__main__":
    train()
