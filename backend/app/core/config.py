# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     DATABASE_URL: str = "postgresql://fraud_user:yourpassword123@localhost/fraud_db"
#     REDIS_URL: str    = "redis://localhost:6379"
#     SECRET_KEY: str   = "your-super-secret-key-change-this"
#     ALGORITHM: str    = "HS256"
#     ALLOWED_ORIGINS: list = ["http://localhost:5173"]

#     class Config:
#         env_file = ".env"

# settings = Settings()
# backend/app/core/config.py

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://fraud_user:yourpassword123@localhost/fraud_db"
    REDIS_URL: str    = "redis://localhost:6379"
    SECRET_KEY: str   = "your-super-secret-key-change-this"
    ALGORITHM: str    = "HS256"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173"]
    FIREBASE_PROJECT_ID: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"          # ← THIS fixes the pydantic error

settings = Settings()