import hashlib
import secrets
from datetime import datetime, timedelta
from .database import (
    create_user as db_create_user, 
    get_user_by_email, 
    save_token, 
    verify_token as db_verify_token, 
    get_user_by_id as db_get_user_by_id,
    update_user_password_hash
)

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hash_obj = hashlib.sha256((salt + password).encode())
    return f"{salt}:{hash_obj.hexdigest()}"

def verify_password(password: str, hashed: str) -> bool:
    salt, hash_value = hashed.split(':')
    hash_obj = hashlib.sha256((salt + password).encode())
    return hash_obj.hexdigest() == hash_value

def create_token(user_id: str) -> str:
    return secrets.token_urlsafe(32)

async def init_auth_db():
    print("✅ Auth tables ready")

async def create_user(username: str, email: str, password: str, full_name: str = None):
    password_hash = hash_password(password)
    return await db_create_user(username, email, password_hash, full_name)

async def login_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        raise ValueError("Invalid email or password")
    
    if not verify_password(password, user['password_hash']):
        raise ValueError("Invalid email or password")
    
    token = create_token(user['id'])
    expires_at = datetime.now() + timedelta(days=30)
    await save_token(token, user['id'], expires_at)
    
    created_at = user['created_at']
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()
    
    return {
        "access_token": token,
        "user": {
            "id": user['id'],
            "username": user['username'],
            "email": user['email'],
            "full_name": user['full_name'],
            "created_at": created_at
        }
    }

async def verify_token(token: str):
    return await db_verify_token(token)

async def get_user_by_id(user_id: str):
    return await db_get_user_by_id(user_id)

async def update_password(user_id: str, current_password: str, new_password: str):
    """Update user password"""
    user = await get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    
    if not verify_password(current_password, user['password_hash']):
        raise ValueError("Current password is incorrect")
    
    new_hash = hash_password(new_password)
    await update_user_password_hash(user_id, new_hash)
    return True