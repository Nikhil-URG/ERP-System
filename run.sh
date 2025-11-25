#!/usr/bin/env bash
set -e

echo "=== Starting Docker Services ==="
docker compose up -d

# ------------------------------
# WAIT FOR POSTGRES (multi-platform safe)
# ------------------------------

echo "Waiting for PostgreSQL to respond on port 5432..."

until docker exec erp-system-db-1 pg_isready -U postgres >/dev/null 2>&1; do
  echo "Postgres not ready... waiting"
  sleep 2
done

echo "PostgreSQL is up!"

# ------------------------------
# BACKEND SETUP
# ------------------------------

echo "Using backend virtual environment."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating venv..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Running Alembic migrations..."
export DATABASE_URL="postgresql+asyncpg://erp_user:erp_password@localhost:5432/erp_db"
alembic upgrade head

echo "Running seed script..."
python3 seed.py
unset DATABASE_URL # Unset to allow FastAPI to pick from .env or its own environment

echo "Starting FastAPI..."
export DATABASE_URL="postgresql+asyncpg://erp_user:erp_password@localhost:5432/erp_db"
uvicorn app.main:app --host 0.0.0.0 --port 8001 &
FASTAPI_PID=$!
echo "Waiting 5 seconds for FastAPI to start..."
sleep 5

cd ..

# ------------------------------
# WAIT FOR FASTAPI
# ------------------------------

echo "Waiting for FastAPI to start..."

until curl -s http://localhost:8001/ >/dev/null 2>&1; do
    echo "FastAPI not ready... waiting"
    sleep 2
done

echo "FastAPI is running!"

# ------------------------------
# FRONTEND START
# ------------------------------

echo "Starting React frontend..."
cd frontend

npm install
npm start &
FRONTEND_PID=$!

cd ..

echo "All services started!"
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8001"
echo "PgAdmin:   http://localhost:5050"

trap "echo 'Stopping...'; kill $FASTAPI_PID $FRONTEND_PID; docker compose down" EXIT

wait
