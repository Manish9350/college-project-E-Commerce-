#!/usr/bin/env bash
set -euo pipefail

# Railway/Render-ready startup script
# - Builds frontend if present
# - Installs backend dependencies
# - Optionally seeds the database when SEED_DB=true
# - Starts the backend with node server.js

cd "$(dirname "$0")" || exit 1

echo "=== Starting application ==="

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js not found in PATH"
  exit 1
fi

echo "Node: $(node -v)    NPM: $(npm -v)"

# Build frontend if present
FRONT_DIR=""
if [ -d "frontened" ]; then
  FRONT_DIR="frontened"
elif [ -d "frontend" ]; then
  FRONT_DIR="frontend"
fi

if [ -n "$FRONT_DIR" ]; then
  echo "Building frontend in $FRONT_DIR..."
  cd "$FRONT_DIR"
  npm ci
  if npm run build 2>/dev/null; then
    echo "✓ Frontend built successfully"
  else
    echo "⚠ Frontend build skipped (no build script or failed)"
  fi
  cd - >/dev/null
fi

# Install and start backend
echo "Setting up backend..."
cd backend

npm ci --only=production

# Optional: seed database
if [ "${SEED_DB:-false}" = "true" ]; then
  echo "Seeding database..."
  node seedDatabase.js
fi

echo "Starting backend server..."
exec node server.js

