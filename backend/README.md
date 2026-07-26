# F1+Food Backend

FastAPI backend for the F1+Food AI food-rescue platform. Serves the
Restaurant, NGO, Impact, and Event Calendar dashboards shown in `frontend/`.

## Stack
- FastAPI + Uvicorn
- SQLAlchemy ORM, SQLite for local dev (swap `DATABASE_URL` for Postgres in prod)
- JWT auth (python-jose) + bcrypt password hashing (passlib)

## Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs
Health check: http://localhost:8000/health

## Seed synthetic data

Populates 42 restaurants, 18 NGOs across 6 zones, and enough completed
rescues to match the numbers shown on the Impact dashboard (520 meals saved,
~12 min average pickup):

```bash
python -m app.seed.seed_data
```

Demo login for any seeded account: password `demo1234`
(e.g. `restaurant0@f1food.demo`, `ngo0@f1food.demo`).

## API overview

| Area | Routes |
|---|---|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` |
| Restaurant | `POST /api/v1/restaurants/listings`, `POST /api/v1/restaurants/listings/{id}/confirm`, `GET /api/v1/restaurants/listings` |
| NGO | `GET /api/v1/ngos/rescues`, `POST /api/v1/ngos/rescues/{id}/confirm`, `POST /api/v1/ngos/rescues/{id}/complete` |
| Impact | `GET /api/v1/impact/summary` |
| Calendar | `GET /api/v1/calendar/events`, `POST /api/v1/calendar/events` |

## How the 4 AI stages map to code

Each stage currently lives as a **stubbed service** in `app/services/`, built
with a stable function signature so it can be swapped for the real trained
model (from `AI/` + `models/`) without touching the API layer:

1. **Computer Vision** — `services/cv_meal_count.py` → `AI/cv_meal_count/`
2. **Freshness AI** — `services/freshness_ai.py` → `AI/freshness_ai/`
3. **Surplus Prediction** — `services/surplus_prediction.py` → `AI/surplus_prediction/`
4. **Rescue Routing** — `services/routing.py` → `AI/routing/`

## Project layout

```
backend/
  app/
    core/          # config, db session, security/JWT
    models/        # SQLAlchemy models
    schemas/        # Pydantic request/response schemas
    api/routes/     # auth, restaurants, ngos, impact, calendar
    services/       # AI-stage stubs, swappable for real models
    seed/           # synthetic data generator
    main.py
  requirements.txt
  .env.example
```
