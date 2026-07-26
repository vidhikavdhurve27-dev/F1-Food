from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.partners import NGO, Restaurant
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password), role=payload.role)
    db.add(user)
    db.flush()  # get user.id before creating the linked profile

    if payload.role == UserRole.RESTAURANT:
        db.add(Restaurant(
            user_id=user.id, name=payload.name, address=payload.address,
            lat=payload.lat, lng=payload.lng, phone=payload.phone,
        ))
    elif payload.role == UserRole.NGO:
        db.add(NGO(
            user_id=user.id, name=payload.name, address=payload.address,
            lat=payload.lat, lng=payload.lng, phone=payload.phone,
        ))

    db.commit()
    token = create_access_token(subject=user.id, role=user.role.value)
    return TokenResponse(access_token=token, role=user.role)


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(subject=user.id, role=user.role.value)
    return TokenResponse(access_token=token, role=user.role)
