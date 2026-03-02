from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime
from decimal import Decimal

class TransactionCreate(BaseModel):
    amount:    Decimal
    merchant:  Optional[str] = None
    location:  Optional[str] = None
    device_id: Optional[str] = None
    user_id:   Optional[UUID4] = None

class TransactionResponse(BaseModel):
    id:          UUID4
    amount:      Decimal
    merchant:    Optional[str]
    location:    Optional[str]
    fraud_score: Optional[float]
    is_fraud:    bool
    status:      str
    timestamp:   datetime

    class Config:
        from_attributes = True  # Pydantic v2