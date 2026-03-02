# backend/app/models/alert.py
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid, datetime

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"))
    reason         = Column(Text)
    confidence     = Column(Float)
    reviewed_by    = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    review_status  = Column(String(50), default="pending")
    created_at     = Column(DateTime, default=datetime.datetime.utcnow)
    transaction    = relationship("Transaction", back_populates="alerts")