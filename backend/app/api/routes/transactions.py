from fastapi import APIRouter, Depends, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.models.transaction import Transaction
from app.services.fraud_engine import FraudEngine
from app.services.velocity_check import check_velocity
from app.services.alert_publisher import publish_fraud_alert
from app.db.session import get_db

router = APIRouter()
fraud_engine = FraudEngine()

@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    payload: TransactionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # STEP 1 — Check velocity limits via Redis
    velocity_flags = await check_velocity(str(payload.user_id), float(payload.amount))
    velocity_risk  = any(velocity_flags.values())

    # STEP 2 — XGBoost fraud prediction (with Redis cache)
    fraud_score, is_fraud_ml = await fraud_engine.predict_with_cache(payload)

    # STEP 3 — Combine ML score + velocity signals
    is_fraud    = is_fraud_ml or velocity_risk
    final_score = min(1.0, fraud_score + (0.2 if velocity_risk else 0))

    # STEP 4 — Save to PostgreSQL
    txn = Transaction(
        amount    = payload.amount,
        merchant  = payload.merchant,
        location  = payload.location,
        device_id = payload.device_id,
        user_id   = payload.user_id,
        fraud_score = round(final_score, 4),
        is_fraud  = is_fraud,
        status    = "flagged" if is_fraud else "cleared"
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)

    # STEP 5 — Publish alert via Redis Pub/Sub (non-blocking)
    if is_fraud:
        background_tasks.add_task(
            publish_fraud_alert, str(txn.id), final_score, str(payload.user_id), velocity_flags
        )

    return txn

@router.get("/", response_model=List[TransactionResponse])
def list_transactions(
    skip: int = Query(0),
    limit: int = Query(50),
    is_fraud: bool = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(Transaction)
    if is_fraud is not None:
        q = q.filter(Transaction.is_fraud == is_fraud)
    return q.order_by(Transaction.timestamp.desc()).offset(skip).limit(limit).all()