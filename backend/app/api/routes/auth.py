# backend/app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_firebase_claims
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/health")
def auth_health():
    return {"status": "auth route working"}


@router.post("/sync", response_model=UserResponse)
def sync_user(
    claims: dict = Depends(get_firebase_claims),
    db: Session = Depends(get_db),
):
    """
    Ensures a Firebase-authenticated user exists in Postgres.
    We key off firebase_uid for stable identity across logins/providers.
    """
    firebase_uid = claims.get("uid")
    email = claims.get("email")
    if not firebase_uid or not email:
        # Email should exist for Google sign-in, but keep this defensive.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token missing uid/email",
        )

    # 1) Prefer linking by firebase uid
    user = db.query(User).filter(User.firebase_uid == firebase_uid).one_or_none()
    if user:
        if user.email != email:
            user.email = email
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    # 2) If an email record exists (e.g. old user), link it
    user = db.query(User).filter(User.email == email).one_or_none()
    if user:
        user.firebase_uid = firebase_uid
        if user.hashed_password is None:
            user.hashed_password = ""
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    # 3) Create new user
    user = User(
        email=email,
        firebase_uid=firebase_uid,
        hashed_password="",
        role="analyst",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
def me(
    claims: dict = Depends(get_firebase_claims),
    db: Session = Depends(get_db),
):
    firebase_uid = claims.get("uid")
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token missing uid",
        )
    user = db.query(User).filter(User.firebase_uid == firebase_uid).one_or_none()
    if not user:
        # auto-sync on first request
        return sync_user(claims=claims, db=db)
    return user