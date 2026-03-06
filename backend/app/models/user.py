# backend/app/models/user.py
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
import uuid, datetime

class User(Base):
    __tablename__ = "users"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email           = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=True, default="")
    role            = Column(String(50), default="analyst")
    firebase_uid    = Column(String(255), unique=True, nullable=True)
    created_at      = Column(DateTime, default=datetime.datetime.utcnow)