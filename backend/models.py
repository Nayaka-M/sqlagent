from pydantic import BaseModel
from typing import Optional, List, Any

# ============ AUTH MODELS ============

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str] = None
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ============ PROFILE MODELS ============

class UserProfileUpdate(BaseModel):
    full_name: str
    email: str

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

# ============ DATABASE CONNECTION MODELS ============

class DatabaseConnectionRequest(BaseModel):
    db_name: str
    db_type: str
    host: str
    port: int
    username: str
    password: str
    database_name: str

class DatabaseConnectionResponse(BaseModel):
    id: str
    db_name: str
    db_type: str
    host: str
    port: int
    username: str
    database_name: str
    created_at: str
    last_used: Optional[str] = None

# ============ QUERY MODELS ============

class QueryRequest(BaseModel):
    prompt: str
    db_id: Optional[str] = None

class QueryResponse(BaseModel):
    success: bool
    sqlQuery: str
    logId: str
    result: Optional[Any] = None
    row_count: Optional[int] = None
    execution_time: Optional[int] = None
    error: Optional[str] = None
    explanation: Optional[str] = None
    message: str = "Query executed successfully!"

class LogResponse(BaseModel):
    id: str
    userId: str
    prompt: str
    sqlQuery: str
    createdAt: str
    result: Optional[Any] = None
    error: Optional[str] = None
    execution_time: Optional[int] = None

class ProfileResponse(BaseModel):
    user: UserResponse
    total_queries: int
    recent_queries: List[LogResponse]