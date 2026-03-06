from __future__ import annotations

from typing import Optional, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

import firebase_admin
from firebase_admin import credentials as fb_credentials
from firebase_admin import auth as fb_auth

from app.core.config import settings


_bearer = HTTPBearer(auto_error=False)


def _init_firebase_admin() -> None:
    if firebase_admin._apps:
        return

    cred_path = (settings.FIREBASE_SERVICE_ACCOUNT_PATH or "").strip()
    if cred_path:
        cred = fb_credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        return

    # Fallback to application default credentials (useful in some hosted envs).
    firebase_admin.initialize_app()


def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    try:
        _init_firebase_admin()
        decoded = fb_auth.verify_id_token(id_token)
        return decoded
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
        )


def get_firebase_claims(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> Dict[str, Any]:
    if not creds or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )
    return verify_firebase_token(creds.credentials)
