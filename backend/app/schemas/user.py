from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime


class UserResponse(BaseModel):
    id: UUID4
    email: str
    firebase_uid: Optional[str] = None
    role: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
