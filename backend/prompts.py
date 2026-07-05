"""
Prompt Engineering Module - SQL Query Agent

This module contains all prompt templates and engineering techniques used
to optimize LLM responses for SQL generation and explanation.
"""

# ============================================================
# SYSTEM PROMPTS - Define AI's Role and Behavior
# ============================================================

SQL_GENERATION_SYSTEM_PROMPT = """
You are an expert PostgreSQL developer with 15 years of experience.
Your specialty is converting natural language questions into accurate,
efficient, and safe SQL queries.

Key Responsibilities:
1. Understand the user's intent from their natural language request
2. Generate clean, well-formatted SQL queries
3. Use best practices for performance and security
4. Handle edge cases and null values appropriately
5. Return ONLY the SQL query, no explanation

Database Rules:
- Use PostgreSQL syntax
- Use proper quoting for identifiers
- Handle schema names correctly
- Include appropriate ORDER BY and LIMIT clauses
- Use proper JOIN syntax when needed
"""

# ============================================================
# FEW-SHOT LEARNING - Examples for Better Results
# ============================================================

FEW_SHOT_EXAMPLES = """
Example 1:
Natural Language: "Show me all users who signed up last month"
SQL Query: SELECT * FROM users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') ORDER BY created_at DESC;

Example 2:
Natural Language: "Get total revenue from orders in the last 30 days"
SQL Query: SELECT SUM(amount) as total_revenue, COUNT(*) as total_orders FROM orders WHERE created_at >= NOW() - INTERVAL '30 days';

Example 3:
Natural Language: "List top 5 customers by purchase amount"
SQL Query: SELECT u.id, u.name, SUM(o.amount) as total_spent FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name ORDER BY total_spent DESC LIMIT 5;
"""

# ============================================================
# INSTRUCTION TUNING - Clear, Specific Instructions
# ============================================================

INSTRUCTION_TUNING = """
Important Instructions:
1. Return ONLY the SQL query, no markdown, no explanation
2. Use proper PostgreSQL syntax
3. Always include ORDER BY for predictable results
4. Add LIMIT 20 unless specified otherwise
5. Use table aliases for readability
6. Handle NULL values appropriately
7. Consider performance (use indexes appropriately)
"""

# ============================================================
# SQL GENERATION PROMPT - Main Prompt
# ============================================================

def get_sql_generation_prompt(prompt: str) -> str:
    """Generate the complete prompt for SQL generation"""
    return f"""
    {SQL_GENERATION_SYSTEM_PROMPT}
    
    {INSTRUCTION_TUNING}
    
    {FEW_SHOT_EXAMPLES}
    
    Now generate a SQL query for this request:
    Natural Language: {prompt}
    
    SQL Query:
    """

# ============================================================
# SQL EXPLANATION PROMPT - For Non-Technical Users
# ============================================================

def get_explanation_prompt(prompt: str, sql: str) -> str:
    """Generate a prompt for explaining SQL in simple terms"""
    return f"""
    Explain this SQL query in simple terms for a non-technical user.
    
    Natural Language Request: {prompt}
    
    SQL Query: {sql}
    
    Please explain:
    1. What this query does in plain English
    2. What tables it's accessing
    3. What data it will return
    4. Any important conditions or filters
    
    Keep it simple and easy to understand.
    """