import asyncpg
import json
import time
from datetime import datetime, date, time as dt_time
import decimal

async def execute_postgresql(config: dict, query: str):
    """Execute query on PostgreSQL database"""
    try:
        start_time = time.time()
        
        conn = await asyncpg.connect(
            host=config['host'],
            port=config['port'],
            user=config['username'],
            password=config['password'],
            database=config['database_name']
        )
        
        result = await conn.fetch(query)
        await conn.close()
        
        execution_time = int((time.time() - start_time) * 1000)
        
        data = []
        for row in result:
            row_dict = {}
            for key, value in row.items():
                if value is None:
                    row_dict[key] = None
                elif isinstance(value, (datetime, date)):
                    row_dict[key] = value.isoformat()
                elif isinstance(value, dt_time):
                    row_dict[key] = value.isoformat()
                elif isinstance(value, decimal.Decimal):
                    row_dict[key] = float(value)
                elif isinstance(value, (int, float, str, bool)):
                    row_dict[key] = value
                elif isinstance(value, (list, dict)):
                    row_dict[key] = value
                else:
                    try:
                        row_dict[key] = str(value)
                    except:
                        row_dict[key] = None
            data.append(row_dict)
        
        return {
            "success": True,
            "data": data,
            "row_count": len(data),
            "execution_time": execution_time
        }
    except Exception as e:
        print(f"❌ Query execution error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def execute_query(db_type: str, config: dict, query: str):
    if db_type == "postgresql":
        return await execute_postgresql(config, query)
    else:
        return {"success": False, "error": f"Unsupported database type: {db_type}"}