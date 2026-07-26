from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app import models  # noqa: F401 — ensures all models are registered on Base.metadata

settings = get_settings()

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.on_event("startup")
def on_startup():
    # Dev convenience: create tables if they don't exist yet.
    # Swap for Alembic migrations once the schema stabilizes.
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
