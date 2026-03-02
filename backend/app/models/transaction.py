# backend/app/models/transaction.py
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid, datetime

class Transaction(Base):
    __tablename__ = "transactions"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), nullable=True)
    amount      = Column(Numeric(15, 2), nullable=False)
    merchant    = Column(String(255), nullable=True)
    location    = Column(String(255), nullable=True)
    device_id   = Column(String(255), nullable=True)
    timestamp   = Column(DateTime, default=datetime.datetime.utcnow)
    fraud_score = Column(Float, nullable=True)
    is_fraud    = Column(Boolean, default=False)
    status      = Column(String(50), default="pending")
    alerts      = relationship("FraudAlert", back_populates="transaction")