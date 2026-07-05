import asyncio
import json
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List, Dict

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        self.user_connections[user_id] = websocket
        print(f"✅ User {user_id} connected")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                pass
        if user_id in self.user_connections:
            del self.user_connections[user_id]
        print(f"❌ User {user_id} disconnected")

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            try:
                await self.user_connections[user_id].send_text(json.dumps(message))
                return True
            except:
                return False
        return False

    async def broadcast(self, message: dict):
        for user_id, websocket in self.user_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except:
                pass

manager = ConnectionManager()

# Real-time event types
class SocketEvents:
    QUERY_START = "query_start"
    QUERY_PROGRESS = "query_progress"
    QUERY_COMPLETE = "query_complete"
    QUERY_ERROR = "query_error"
    DATABASE_CONNECTED = "db_connected"
    DATABASE_DISCONNECTED = "db_disconnected"
    NOTIFICATION = "notification"
    NEW_QUERY_LOG = "new_query_log"
    USER_ONLINE = "user_online"
    USER_OFFLINE = "user_offline"

async def handle_websocket(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    
    # Send welcome message
    await manager.send_personal_message({
        "type": "connection",
        "message": "Connected to real-time server",
        "timestamp": datetime.now().isoformat()
    }, user_id)

    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            message_type = message.get("type")
            
            if message_type == "ping":
                await manager.send_personal_message({"type": "pong"}, user_id)
            
            elif message_type == "query_status":
                # Client asking for query status
                await manager.send_personal_message({
                    "type": "status",
                    "message": "Query is being processed...",
                    "timestamp": datetime.now().isoformat()
                }, user_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"Error: {e}")
        manager.disconnect(websocket, user_id)

# Real-time notification sender
async def send_realtime_notification(user_id: str, title: str, message: str, type: str = "info"):
    """Send a real-time notification to a specific user"""
    notification = {
        "type": "notification",
        "notification_type": type,
        "title": title,
        "message": message,
        "timestamp": datetime.now().isoformat(),
        "read": False
    }
    return await manager.send_personal_message(notification, user_id)

async def broadcast_query_update(user_id: str, query_id: str, status: str, data: any = None):
    """Broadcast query status updates"""
    update = {
        "type": "query_update",
        "query_id": query_id,
        "status": status,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
    await manager.send_personal_message(update, user_id)