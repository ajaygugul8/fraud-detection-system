from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import transactions, alerts, auth, ws
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# Create tables on startup (for dev; use alembic in production)
Base.metadata.create_all(bind=engine)

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

# Register all routers
app.include_router(auth.router,         prefix="/api/auth",         tags=["auth"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(alerts.router,       prefix="/api/alerts",        tags=["alerts"])
app.include_router(ws.router,           prefix="/ws",               tags=["websocket"])

@app.get("/")
async def root():
    return {"status": "Fraud Detection API is running 🚀"}