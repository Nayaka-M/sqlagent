import asyncpg
import os
import json
import uuid
from datetime import datetime
from dotenv import load_dotenv
import base64

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def encrypt_password(password: str) -> str:
    return base64.b64encode(password.encode()).decode()

def decrypt_password(encrypted: str) -> str:
    return base64.b64decode(encrypted.encode()).decode()

async def get_connection():
    return await asyncpg.connect(DATABASE_URL)

async def init_db():
    conn = await get_connection()
    
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS user_databases (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            db_name TEXT NOT NULL,
            db_type TEXT NOT NULL,
            host TEXT NOT NULL,
            port INTEGER NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            database_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_used TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS query_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            db_id TEXT,
            prompt TEXT NOT NULL,
            sql_query TEXT NOT NULL,
            result JSONB,
            error TEXT,
            execution_time INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (db_id) REFERENCES user_databases(id) ON DELETE SET NULL
        )
    ''')
    
    await conn.close()
    print("✅ PostgreSQL tables created successfully!")

async def connect_db():
    try:
        await init_db()
        print("✅ PostgreSQL database connected!")
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        raise

async def disconnect_db():
    print("✅ Database disconnected!")

# ============ USER FUNCTIONS ============

async def create_user(username: str, email: str, password_hash: str, full_name: str = None):
    conn = await get_connection()
    user_id = str(uuid.uuid4())
    
    try:
        await conn.execute(
            "INSERT INTO users (id, username, email, password_hash, full_name) VALUES ($1, $2, $3, $4, $5)",
            user_id, username, email, password_hash, full_name
        )
        await conn.close()
        return {
            "id": user_id,
            "username": username,
            "email": email,
            "full_name": full_name,
            "created_at": datetime.now().isoformat()
        }
    except asyncpg.exceptions.UniqueViolationError as e:
        await conn.close()
        if "username" in str(e):
            raise ValueError("Username already exists")
        elif "email" in str(e):
            raise ValueError("Email already exists")
        raise e

async def get_user_by_email(email: str):
    conn = await get_connection()
    try:
        row = await conn.fetchrow("SELECT * FROM users WHERE email = $1", email)
        if row:
            data = dict(row)
            if data.get('created_at') and isinstance(data['created_at'], datetime):
                data['created_at'] = data['created_at'].isoformat()
            return data
        return None
    finally:
        await conn.close()

async def get_user_by_id(user_id: str):
    conn = await get_connection()
    try:
        row = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
        if row:
            data = dict(row)
            if data.get('created_at') and isinstance(data['created_at'], datetime):
                data['created_at'] = data['created_at'].isoformat()
            return data
        return None
    finally:
        await conn.close()

# ============ PROFILE UPDATE FUNCTIONS ============

async def update_user_profile(user_id: str, full_name: str, email: str):
    conn = await get_connection()
    try:
        existing = await conn.fetchrow(
            "SELECT id FROM users WHERE email = $1 AND id != $2",
            email, user_id
        )
        if existing:
            await conn.close()
            raise ValueError("Email already in use")
        
        await conn.execute(
            "UPDATE users SET full_name = $1, email = $2 WHERE id = $3",
            full_name, email, user_id
        )
        await conn.close()
        return True
    except Exception as e:
        await conn.close()
        raise e

async def update_user_password_hash(user_id: str, password_hash: str):
    conn = await get_connection()
    try:
        await conn.execute(
            "UPDATE users SET password_hash = $1 WHERE id = $2",
            password_hash, user_id
        )
        await conn.close()
        return True
    except Exception as e:
        await conn.close()
        raise e

async def get_user_profile_stats(user_id: str):
    conn = await get_connection()
    try:
        query_count = await conn.fetchrow(
            "SELECT COUNT(*) as total FROM query_logs WHERE user_id = $1",
            user_id
        )
        
        db_count = await conn.fetchrow(
            "SELECT COUNT(*) as total FROM user_databases WHERE user_id = $1",
            user_id
        )
        
        recent_queries = await conn.fetch(
            "SELECT * FROM query_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
            user_id
        )
        
        stats = await conn.fetchrow(
            "SELECT AVG(execution_time) as avg_time FROM query_logs WHERE user_id = $1 AND execution_time IS NOT NULL",
            user_id
        )
        
        user = await get_user_by_id(user_id)
        
        await conn.close()
        
        recent_queries_list = []
        for q in recent_queries:
            q_dict = dict(q)
            if q_dict.get('created_at') and isinstance(q_dict['created_at'], datetime):
                q_dict['created_at'] = q_dict['created_at'].isoformat()
            if q_dict.get('result'):
                try:
                    q_dict['result'] = json.loads(q_dict['result']) if isinstance(q_dict['result'], str) else q_dict['result']
                except:
                    q_dict['result'] = None
            recent_queries_list.append(q_dict)
        
        return {
            "total_queries": query_count['total'] if query_count else 0,
            "total_databases": db_count['total'] if db_count else 0,
            "avg_execution_time": float(stats['avg_time']) if stats and stats['avg_time'] else 0,
            "recent_queries": recent_queries_list,
            "user": user
        }
    except Exception as e:
        await conn.close()
        raise e

# ============ TOKEN FUNCTIONS ============

async def save_token(token: str, user_id: str, expires_at: datetime):
    conn = await get_connection()
    try:
        await conn.execute(
            "INSERT INTO tokens (token, user_id, expires_at) VALUES ($1, $2, $3)",
            token, user_id, expires_at
        )
    finally:
        await conn.close()

async def verify_token(token: str):
    conn = await get_connection()
    try:
        row = await conn.fetchrow(
            "SELECT u.* FROM tokens t JOIN users u ON t.user_id = u.id WHERE t.token = $1 AND t.expires_at > NOW()",
            token
        )
        if row:
            data = dict(row)
            if data.get('created_at') and isinstance(data['created_at'], datetime):
                data['created_at'] = data['created_at'].isoformat()
            return data
        return None
    finally:
        await conn.close()

# ============ DATABASE CONNECTION FUNCTIONS ============

async def save_database_connection(user_id: str, db_data: dict):
    conn = await get_connection()
    db_id = str(uuid.uuid4())
    encrypted_password = encrypt_password(db_data['password'])
    
    try:
        user_check = await conn.fetchrow("SELECT id FROM users WHERE id = $1", user_id)
        if not user_check:
            print(f"❌ User {user_id} not found!")
            raise ValueError(f"User {user_id} not found")
        
        await conn.execute(
            '''INSERT INTO user_databases 
               (id, user_id, db_name, db_type, host, port, username, password, database_name)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)''',
            db_id, user_id, db_data['db_name'], db_data['db_type'],
            db_data['host'], db_data['port'], db_data['username'],
            encrypted_password, db_data['database_name']
        )
        print(f"✅ Database connection saved: {db_data['db_name']}")
        return db_id
    except Exception as e:
        print(f"❌ Error saving database connection: {e}")
        raise
    finally:
        await conn.close()

async def get_user_databases(user_id: str):
    conn = await get_connection()
    try:
        rows = await conn.fetch(
            "SELECT id, db_name, db_type, host, port, username, database_name, created_at, last_used FROM user_databases WHERE user_id = $1 ORDER BY created_at DESC",
            user_id
        )
        result = []
        for row in rows:
            data = dict(row)
            if data.get('created_at') and isinstance(data['created_at'], datetime):
                data['created_at'] = data['created_at'].isoformat()
            if data.get('last_used') and isinstance(data['last_used'], datetime):
                data['last_used'] = data['last_used'].isoformat()
            result.append(data)
        print(f"✅ Found {len(result)} databases for user {user_id}")
        return result
    except Exception as e:
        print(f"❌ Error getting databases: {e}")
        return []
    finally:
        await conn.close()

async def get_database_connection(db_id: str, user_id: str):
    conn = await get_connection()
    try:
        row = await conn.fetchrow(
            "SELECT * FROM user_databases WHERE id = $1 AND user_id = $2",
            db_id, user_id
        )
        if not row:
            return None
        data = dict(row)
        data['password'] = decrypt_password(data['password'])
        return data
    finally:
        await conn.close()

# ============ QUERY LOG FUNCTIONS ============

async def create_log(user_id: str, prompt: str, sql_query: str, 
                     result: dict = None, error: str = None, 
                     execution_time: int = None, db_id: str = None):
    conn = await get_connection()
    log_id = str(uuid.uuid4())
    
    if result:
        for row in result:
            for key, value in row.items():
                if isinstance(value, datetime):
                    row[key] = value.isoformat()
    
    result_json = json.dumps(result) if result else None
    
    try:
        await conn.execute(
            '''INSERT INTO query_logs 
               (id, user_id, db_id, prompt, sql_query, result, error, execution_time)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)''',
            log_id, user_id, db_id, prompt, sql_query, result_json, error, execution_time
        )
        class Log:
            def __init__(self, id):
                self.id = id
        return Log(log_id)
    finally:
        await conn.close()

async def get_logs(user_id: str, limit: int = 50):
    conn = await get_connection()
    try:
        rows = await conn.fetch(
            "SELECT * FROM query_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2",
            user_id, limit
        )
        logs = []
        for row in rows:
            log = dict(row)
            if log.get('created_at') and isinstance(log['created_at'], datetime):
                log['created_at'] = log['created_at'].isoformat()
            if log.get('result'):
                try:
                    log['result'] = json.loads(log['result']) if isinstance(log['result'], str) else log['result']
                except:
                    log['result'] = None
            logs.append(log)
        return logs
    finally:
        await conn.close()

async def get_log_by_id(log_id: str, user_id: str):
    conn = await get_connection()
    try:
        row = await conn.fetchrow(
            "SELECT * FROM query_logs WHERE id = $1 AND user_id = $2",
            log_id, user_id
        )
        if row:
            log = dict(row)
            if log.get('created_at') and isinstance(log['created_at'], datetime):
                log['created_at'] = log['created_at'].isoformat()
            if log.get('result'):
                try:
                    log['result'] = json.loads(log['result']) if isinstance(log['result'], str) else log['result']
                except:
                    log['result'] = None
            return log
        return None
    finally:
        await conn.close()

async def get_user_stats(user_id: str):
    conn = await get_connection()
    try:
        row = await conn.fetchrow(
            "SELECT COUNT(*) as total_queries FROM query_logs WHERE user_id = $1",
            user_id
        )
        return {"total_queries": row['total_queries'] if row else 0}
    finally:
        await conn.close()