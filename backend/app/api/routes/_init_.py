from fastapi import APIRouter

from app.api.routes import auth, calendar, impact, ngos, restaurants

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(restaurants.router)
api_router.include_router(ngos.router)
api_router.include_router(impact.router)
api_router.include_router(calendar.router)
