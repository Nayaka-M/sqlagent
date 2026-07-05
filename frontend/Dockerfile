version: '3.8'

services:
  # Backend Service
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: sql-query-agent-backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/sqlagent
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - ENV=production
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app/backend
      - ./logs:/app/logs
    networks:
      - sql-agent-network
    restart: unless-stopped

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: sql-query-agent-frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:3001
    depends_on:
      - backend
    volumes:
      - ./frontend:/app/frontend
      - /app/frontend/node_modules
    networks:
      - sql-agent-network
    restart: unless-stopped

  # Database Service
  db:
    image: postgres:15-alpine
    container_name: sql-query-agent-db
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=sqlagent
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - sql-agent-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Optional: Adminer for Database Management
  adminer:
    image: adminer:latest
    container_name: sql-query-agent-adminer
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - sql-agent-network
    restart: unless-stopped

# Networks
networks:
  sql-agent-network:
    driver: bridge

# Volumes
volumes:
  postgres_data: