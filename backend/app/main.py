import logging
import sys
import traceback

logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
logger = logging.getLogger(__name__)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="Fraud Detection API",
    version="1.0.0",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes
try:
    from app.api.routes import transactions, alerts, auth, ws
    app.include_router(auth.router,         prefix="/api/auth",         tags=["auth"])
    app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
    app.include_router(alerts.router,       prefix="/api/alerts",       tags=["alerts"])
    app.include_router(ws.router,           prefix="/ws",               tags=["websocket"])
    logger.info("✅ All routes loaded")
except Exception as e:
    logger.error(f"❌ Route import failed: {e}")
    traceback.print_exc()

@app.on_event("startup")
async def startup_event():
    # Move database creation here — runs AFTER app starts, not during import
    try:
        from app.db.base import Base
        from app.db.session import engine
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables ready")
    except Exception as e:
        logger.error(f"❌ Database error: {e}")
        traceback.print_exc()

@app.get("/")
async def root():
    return {"status": "Fraud Detection API is running 🚀"}