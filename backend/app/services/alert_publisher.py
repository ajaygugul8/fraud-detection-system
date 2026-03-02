# backend/app/services/alert_publisher.py
import json
from datetime import datetime
from app.core.redis_client import get_redis

CHANNEL = "fraud:alerts"

async def publish_fraud_alert(transaction_id: str, score: float, user_id: str, flags: dict):
    try:
        redis = await get_redis()
        payload = json.dumps({
            "transaction_id": transaction_id,
            "fraud_score":    round(score, 4),
            "user_id":        user_id,
            "flags":          flags,
            "timestamp":      datetime.utcnow().isoformat()
        })
        await redis.publish(CHANNEL, payload)
    except Exception as e:
        print(f"Alert publish failed: {e}")