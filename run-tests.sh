#!/bin/bash

# Exit on any error
set -e

# --- Backend ---
echo "Running backend tests..."
cd backend
source venv/bin/activate
pip3 install -r requirements-test.txt
pytest
cd ..
echo "Backend tests finished."
