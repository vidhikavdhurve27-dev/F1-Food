# F1+Food AI

Four AI stages behind the rescue pipeline. Each stage has its own folder with
a `train.py` (or `estimate.py` for the CV baseline) that generates a
synthetic dataset, trains/validates a model, and saves it to `../models/`
and its dataset to `../datasets/`. The FastAPI backend loads these same
files at runtime from `app/services/`.

| Stage | Folder | What it does | Status |
|---|---|---|---|
| 1. Computer Vision | `cv_meal_count/` | Estimate meal count from a kitchen photo | Classical CV baseline (contour detection), no training data needed yet |
| 2. Freshness AI | `freshness_ai/` | Score 0-1 safety + donation window | Trained gradient-boosted regressor on synthetic data |
| 3. Surplus Prediction | `surplus_prediction/` | Forecast leftover meals | Trained random forest on synthetic data |
| 4. Rescue Routing | `routing/` | Rank NGOs, estimate pickup route | Haversine distance (algorithmic) + trained acceptance-likelihood classifier |

## Why synthetic data for now

None of these models have real restaurant/NGO history yet. Each `train.py`
documents its synthetic data-generating assumptions clearly in comments —
treat those as placeholders to replace once real data is collected, not as
validated real-world behavior. Model quality (MAE/ROC-AUC printed by each
script) reflects fit to synthetic data only.

## Retraining

```bash
cd AI/surplus_prediction && python train.py
cd AI/freshness_ai && python train.py
cd AI/routing && python train.py
```

Each overwrites its dataset in `datasets/` and model in `models/`. The
backend picks up new model files automatically on next restart (no code
changes needed) — see the `_load_model()` helper in each
`backend/app/services/*.py` file.

## Computer Vision — real upgrade path

`cv_meal_count/estimate.py` is a classical baseline (adaptive threshold +
contour counting), validated only against synthetic circle images in
`validate_synthetic.py` — **not real food photos**. Once real kitchen photos
are collected and annotated, replace it with a fine-tuned object detector
(e.g. YOLOv8 or Faster-RCNN) trained on that data, keeping the same
`estimate_meal_count(image_path) -> int` signature so the backend integration
doesn't need to change.
