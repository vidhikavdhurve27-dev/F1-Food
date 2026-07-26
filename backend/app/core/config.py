"""
Application configuration.
Reads from environment variables (see .env.example) with sane dev defaults.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "F1+Food API"
    ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # Database — SQLite for local/dev, swap DATABASE_URL for Postgres in prod
    DATABASE_URL: str = "sqlite:///./f1food.db"

    # Auth
    SECRET_KEY: str = "dev-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS — the deployed Lovable frontend + local dev
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://f1-food-de9cf704.vercel.app",
    ]

    # Donation window default (minutes) used by Freshness AI if model unavailable
    DEFAULT_DONATION_WINDOW_MIN: int = 120


@lru_cache
def get_settings() -> Settings:
    return Settings()
