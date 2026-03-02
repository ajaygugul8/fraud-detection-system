# backend/app/services/fraud_engine.py
import pickle, hashlib, json
import numpy as np
from pathlib import Path
from app.core.redis_client import get_redis

class FraudEngine:
    def __init__(self):
        model_path = Path("app/ml/model.pkl")
        if model_path.exists():
            with open(model_path, "rb") as f:
                self.model = pickle.load(f)
            print("✅ XGBoost model loaded")
        else:
            self.model = None
            print("⚠️  No model found — using rule-based scoring for now")

    def extract_features(self, txn) -> np.ndarray:
        amount     = float(txn.amount) if txn.amount else 0.0
        is_high    = 1 if amount > 1000 else 0
        is_unknown = 1 if txn.location in [None, "unknown", ""] else 0
        return np.array([[amount, is_high, is_unknown, 0, 0,
                          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                          0, 0, 0, 0, 0]])

    async def predict_with_cache(self, txn) -> tuple:
        redis = await get_redis()

        fingerprint = hashlib.md5(json.dumps({
            "amount":   str(txn.amount),
            "location": str(txn.location),
            "merchant": str(txn.merchant),
        }).encode()).hexdigest()

        cache_key = f"fraud_score:{fingerprint}"

        try:
            cached = await redis.get(cache_key)
            if cached:
                score = float(cached)
                return score, score > 0.75
        except Exception:
            pass  # Redis unavailable, continue

        # If model loaded, use XGBoost; else use simple rule
        if self.model:
            features = self.extract_features(txn)
            score = float(self.model.predict_proba(features)[0][1])
        else:
            # Fallback rule-based score (until model.pkl is trained)
            amount = float(txn.amount) if txn.amount else 0.0
            score = min(0.95, amount / 10000)

        try:
            await redis.setex(cache_key, 300, str(score))
        except Exception:
            pass

        return round(score, 4), score > 0.75