#!/bin/bash

# Exit on any error
set -e

# Store background PIDs
PIDS=()

cleanup() {
    echo "Stopping all services..."
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "Killing PID $pid"
            kill "$pid"
        fi
    done
    echo "Stopping PostgreSQL..."
    docker compose down
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT

echo "Starting PostgreSQL..."
docker compose up -d db
echo "PostgreSQL started."

# --- Backend ---
echo "Starting backend..."
cd backend

source venv/bin/activate

alembic upgrade head
python3 seed.py

# Start uvicorn (ONLY ONE INSTANCE)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
PIDS+=($!)

cd ..
echo "Backend started."

# --- Frontend ---
echo "Starting frontend..."
cd frontend

npm install
npm run dev &
PIDS+=($!)

cd ..
echo "Frontend started."

echo "Backend   → http://localhost:8000"
echo "Frontend  → http://localhost:5173"
echo "pgAdmin   → http://localhost:5050"

wait
