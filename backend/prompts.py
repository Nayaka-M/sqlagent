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

SQL_EXPLANATION_SYSTEM_PROMPT = """
You are a friendly SQL teacher who explains complex queries in simple terms.
Your goal is to help non-technical users understand what their SQL query does.

Key Principles:
1. Use plain English, avoid technical jargon
2. Explain step by step what the query does
3. Highlight important conditions and filters
4. Make it easy for beginners to understand
5. Be encouraging and positive in tone
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

Example 4:
Natural Language: "Find products that are out of stock"
SQL Query: SELECT * FROM products WHERE stock_quantity = 0 ORDER BY product_name;

Example 5:
Natural Language: "Show me monthly revenue trend"
SQL Query: SELECT DATE_TRUNC('month', created_at) as month, SUM(amount) as revenue FROM orders GROUP BY month ORDER BY month DESC;
"""

# ============================================================
# CHAIN OF THOUGHT - Step-by-Step Reasoning
# ============================================================

CHAIN_OF_THOUGHT_PROMPT = """
Let me think through this step by step:

1. What does the user want? -> {prompt}
2. What tables are involved? -> {tables}
3. What columns are needed? -> {columns}
4. What conditions/filters apply? -> {conditions}
5. How should the data be sorted? -> {order}
6. What's the final SQL query? -> {sql}

Now generate the SQL query based on this reasoning.
"""

# ============================================================
# CONTEXT INJECTION - Provide Database Schema
# ============================================================

def get_context_prompt(schema_info: str) -> str:
    """Generate context-aware prompt with schema information"""
    return f"""
    Database Schema Information:
    {schema_info}

    Based on this schema, generate the SQL query for the following request.
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
7. Use parameterized queries (no string concatenation)
8. Consider performance (use indexes appropriately)
"""

# ============================================================
# ERROR CORRECTION - Fix Common Mistakes
# ============================================================

ERROR_CORRECTION_PROMPT = """
The previous SQL query had an error. Please correct it:

Error: {error}
Original Query: {sql}

Please provide a corrected version that fixes this error.
"""

# ============================================================
# QUERY OPTIMIZATION - Improve Performance
# ============================================================

OPTIMIZATION_PROMPT = """
Please optimize this SQL query for better performance:

Original Query: {sql}

Provide an optimized version that:
1. Uses appropriate indexes
2. Reduces unnecessary joins
3. Uses proper WHERE conditions
4. Limits result set appropriately
5. Uses EXPLAIN ANALYZE to check performance
"""

# ============================================================
# SQL EXPLANATION PROMPT - For Non-Technical Users
# ============================================================

def get_explanation_prompt(prompt: str, sql: str) -> str:
    """Generate a prompt for explaining SQL in simple terms"""
    return f"""
    {SQL_EXPLANATION_SYSTEM_PROMPT}

    Natural Language Request: {prompt}

    SQL Query: {sql}

    Please explain:
    1. What this query does in plain English
    2. What tables it's accessing
    3. What data it will return
    4. Any important conditions or filters
    5. Why this is the right query for this request

    Use bullet points and simple language.
    """

# ============================================================
# SQL GENERATION PROMPT - Main Prompt
# ============================================================

def get_sql_generation_prompt(prompt: str, db_schema: str = None) -> str:
    """Generate the complete prompt for SQL generation"""
    schema_context = f"\nDatabase Schema:\n{db_schema}\n" if db_schema else ""
    
    return f"""
    {SQL_GENERATION_SYSTEM_PROMPT}

    {INSTRUCTION_TUNING}

    {schema_context}

    {FEW_SHOT_EXAMPLES}

    Now generate a SQL query for this request:
    Natural Language: {prompt}

    SQL Query:
    """

# ============================================================
# REACT PROMPT - Reasoning + Acting
# ============================================================

REACT_PROMPT = """
Reasoning: I need to understand what the user wants and what data is available.

Thought 1: The user wants "{prompt}".
Thought 2: I need to identify the tables and columns involved.
Thought 3: I should filter and sort the data appropriately.

Action: Generate SQL query.

Final Result: {sql}
"""

# ============================================================
# SELF-CONSISTENCY - Multiple Attempts for Better Results
# ============================================================

def get_self_consistency_prompt(prompt: str) -> str:
    """Generate multiple SQL queries and pick the best one"""
    return f"""
    Generate 3 different SQL queries for this request and explain why each is valid:
    
    Request: {prompt}
    
    Query 1:
    Query 2:
    Query 3:
    """

# ============================================================
# FEW-SHOT GENERATION PROMPT - With Examples
# ============================================================

def get_few_shot_prompt(prompt: str, examples: list) -> str:
    """Generate a prompt with custom examples"""
    example_text = ""
    for i, (ex_prompt, ex_sql) in enumerate(examples, 1):
        example_text += f"""
        Example {i}:
        Natural Language: {ex_prompt}
        SQL Query: {ex_sql}
        """
    
    return f"""
    {SQL_GENERATION_SYSTEM_PROMPT}
    
    Examples:
    {example_text}
    
    Now generate a SQL query for:
    Natural Language: {prompt}
    
    SQL Query:
    """

# ============================================================
# USER FEEDBACK PROMPT - Learn from Corrections
# ============================================================

def get_feedback_prompt(original_prompt: str, sql: str, feedback: str) -> str:
    """Incorporate user feedback to improve the query"""
    return f"""
    The user provided feedback on the SQL query.

    Original Request: {original_prompt}
    Generated SQL: {sql}
    User Feedback: {feedback}

    Please generate an improved SQL query that addresses the feedback.
    """

# ============================================================
# PROMPT ENGINEERING TECHNIQUES USED
# ============================================================

"""
Prompt Engineering Techniques in This App:

1. System Prompts - Define AI's role and behavior
2. Few-Shot Learning - Provide examples for better results
3. Chain of Thought - Step-by-step reasoning
4. Instruction Tuning - Clear, specific instructions
5. Context Injection - Provide database schema
6. Error Correction - Fix common mistakes
7. Query Optimization - Improve performance
8. Self-Consistency - Multiple attempts for better results
9. ReAct - Reasoning + Acting
10. User Feedback - Learn from corrections
"""