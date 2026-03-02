# backend/app/api/routes/alerts.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.alert import FraudAlert

router = APIRouter()

@router.get("/")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(FraudAlert).order_by(FraudAlert.created_at.desc()).limit(50).all()