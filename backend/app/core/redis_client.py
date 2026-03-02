# backend/app/core/redis_client.py
import redis.asyncio as aioredis
from app.core.config import settings

_redis_client = None

async def get_redis():
    global _redis_client
    if _redis_client is None:
        try:
            _redis_client = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
        except Exception as e:
            print(f"⚠️  Redis connection failed: {e}")
            return None
    return _redis_client