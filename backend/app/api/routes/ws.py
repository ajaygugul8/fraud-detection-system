# backend/app/api/routes/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.redis_client import get_redis

router = APIRouter()

@router.websocket("/alerts")
async def websocket_alerts(websocket: WebSocket):
    await websocket.accept()
    redis = await get_redis()

    if redis is None:
        await websocket.send_text('{"error": "Redis not available"}')
        await websocket.close()
        return

    pubsub = redis.pubsub()
    await pubsub.subscribe("fraud:alerts")

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                await websocket.send_text(message["data"])
    except WebSocketDisconnect:
        await pubsub.unsubscribe("fraud:alerts")