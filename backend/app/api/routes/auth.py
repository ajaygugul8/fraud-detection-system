# backend/app/api/routes/auth.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def auth_health():
    return {"status": "auth route working"}