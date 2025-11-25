#!/bin/bash

# Exit on any error
set -e

# --- Docker ---
echo "Starting PostgreSQL..."
docker compose up -d db
echo "PostgreSQL started."

# --- Backend ---
echo "Starting backend..."
cd backend
source venv/bin/activate
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
cd ..
echo "Backend started."

# --- Frontend ---
echo "Starting frontend..."
cd frontend
npm install && npm run dev &
cd ..
echo "Frontend started."

echo "All services are starting up..."
echo "Backend available at http://localhost:8000"
echo "Frontend available at http://localhost:5173"
echo "pgAdmin available at http://localhost:5050"

# Wait for user to exit
read -p "Press Enter to stop all services..."

# Stop all background processes
kill 0
