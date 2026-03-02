# backend/app/services/velocity_check.py
from app.core.redis_client import get_redis

async def check_velocity(user_id: str, amount: float) -> dict:
    flags = {}
    try:
        redis = await get_redis()

        # Rule 1: More than 5 transactions in 60 seconds
        key_60s   = f"velocity:{user_id}:count:60s"
        count_60s = await redis.incr(key_60s)
        if count_60s == 1:
            await redis.expire(key_60s, 60)
        flags["rapid_transactions"] = count_60s > 5

        # Rule 2: More than 20 transactions in 1 hour
        key_1h   = f"velocity:{user_id}:count:1h"
        count_1h = await redis.incr(key_1h)
        if count_1h == 1:
            await redis.expire(key_1h, 3600)
        flags["high_frequency"] = count_1h > 20

        # Rule 3: More than $5000 spent in 1 hour
        key_amt   = f"velocity:{user_id}:amount:1h"
        total_amt = await redis.incrbyfloat(key_amt, amount)
        if total_amt == amount:
            await redis.expire(key_amt, 3600)
        flags["high_volume_amount"] = total_amt > 5000

    except Exception:
        # Redis unavailable — skip velocity check, don't crash
        flags = {"rapid_transactions": False, "high_frequency": False, "high_volume_amount": False}

    return flags