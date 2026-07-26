"""
Stage 4 — Rescue Routing.

Route distance/ETA is computed algorithmically (haversine + a traffic
multiplier — see backend/app/services/routing.py), but *which* NGO to offer
first among several within range is a ranking problem. This trains a small
classifier on synthetic historical match outcomes to predict acceptance
likelihood from distance, ETA, spare capacity, and the NGO's track record —
used as a tie-breaker layered on top of raw distance.

Run from AI/routing/:
    python train.py
Outputs:
    ../../datasets/routing_acceptance_synthetic.csv
    ../../models/routing_acceptance.joblib
"""
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

HERE = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(HERE, "..", "..", "datasets")
MODELS_DIR = os.path.join(HERE, "..", "..", "models")


def generate_synthetic_dataset(n_rows: int = 5000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    distance_km = rng.exponential(3.0, n_rows).clip(0.1, 20)
    eta_minutes = (distance_km * 2.5 + rng.normal(0, 2, n_rows)).clip(3, 60)
    spare_capacity_ratio = rng.uniform(0, 1, n_rows)     # (capacity - already_committed) / capacity
    ngo_acceptance_track_record = rng.uniform(0.4, 0.99, n_rows)  # historical accept rate

    # Ground truth: closer, more spare capacity, better track record -> more likely accepted.
    logit = (
        2.2
        - 0.35 * distance_km
        - 0.02 * eta_minutes
        + 2.0 * spare_capacity_ratio
        + 2.5 * (ngo_acceptance_track_record - 0.5)
        + rng.normal(0, 0.5, n_rows)
    )
    prob = 1 / (1 + np.exp(-logit))
    accepted = (rng.uniform(0, 1, n_rows) < prob).astype(int)

    return pd.DataFrame({
        "distance_km": distance_km.round(2),
        "eta_minutes": eta_minutes.round(1),
        "spare_capacity_ratio": spare_capacity_ratio.round(3),
        "ngo_acceptance_track_record": ngo_acceptance_track_record.round(3),
        "accepted": accepted,
    })


def train():
    os.makedirs(DATASETS_DIR, exist_ok=True)
    os.makedirs(MODELS_DIR, exist_ok=True)

    df = generate_synthetic_dataset()
    dataset_path = os.path.join(DATASETS_DIR, "routing_acceptance_synthetic.csv")
    df.to_csv(dataset_path, index=False)

    X = df.drop(columns=["accepted"])
    y = df["accepted"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = Pipeline([
        ("scale", StandardScaler()),
        ("clf", LogisticRegression(max_iter=1000)),
    ])
    model.fit(X_train, y_train)

    auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    print(f"Routing acceptance model ROC-AUC on held-out synthetic data: {auc:.3f}")

    model_path = os.path.join(MODELS_DIR, "routing_acceptance.joblib")
    joblib.dump(model, model_path)
    print(f"Saved dataset -> {dataset_path}")
    print(f"Saved model   -> {model_path}")


if __name__ == "__main__":
    train()
