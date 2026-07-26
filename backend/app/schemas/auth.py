from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    name: str                       # restaurant name or NGO name
    address: str | None = None
    lat: float | None = None
    lng: float | None = None
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
