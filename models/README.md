# Trained Models

| File | Stage | Trained by | Input | Output |
|---|---|---|---|---|
| `freshness_ai.joblib` | Freshness AI | `AI/freshness_ai/train.py` | food_category, hours_since_cooked, storage_temp_c, humidity_pct | freshness_score (0-1) |
| `surplus_prediction.joblib` | Surplus Prediction | `AI/surplus_prediction/train.py` | day_of_week, weather, cuisine_type, avg_daily_sales, local_event | predicted surplus meal count |
| `routing_acceptance.joblib` | Rescue Routing | `AI/routing/train.py` | distance_km, eta_minutes, spare_capacity_ratio, ngo_acceptance_track_record | probability an NGO accepts the match |

All three are currently trained on **synthetic data** (see `datasets/` and
each script's generator function) since real restaurant/NGO history isn't
available yet. Retrain by running the corresponding `train.py` in `AI/` —
it overwrites the `.joblib` file here in place.

There is no `cv_meal_count` model file: that stage currently uses a
classical (non-trained) CV baseline in `AI/cv_meal_count/estimate.py`. A
real trained detector will land here once real kitchen photos are collected.

Loaded at runtime by `backend/app/services/*.py`.
