#!/usr/bin/env bash
set -euo pipefail

# Render-ready startup script for the project backend
# - Builds frontend if present
# - Installs backend dependencies (prefer lockfile with npm ci)
# - Optionally seeds the database when SEED_DB=true
# - Starts the backend with node server.js

cd "$(dirname "$0")" || exit 1

echo "--- Render-ready start.sh: beginning ---"

# Try to find node in common locations if not in PATH
if ! command -v node >/dev/null 2>&1; then
  # Try common Node.js installation paths
  for NODE_PATH in ~/.nvm/versions/node/*/bin/node /usr/local/bin/node /usr/bin/node ~/.local/bin/node; do
    if [ -x "$NODE_PATH" ]; then
      export PATH="$(dirname "$NODE_PATH"):$PATH"
      break
    fi
  done
fi

# If node still not found, try to use apt to install it (for Render/Railway containers)
if ! command -v node >/dev/null 2>&1; then
  echo "Node not found in PATH; attempting system install..."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update && apt-get install -y nodejs npm
  elif command -v apt >/dev/null 2>&1; then
    apt update && apt install -y nodejs npm
  fi
fi

if command -v node >/dev/null 2>&1; then
  echo "✓ Node: $(node -v)    NPM: $(npm -v 2>/dev/null || echo 'npm not found')"
else
  echo "✗ FATAL: Node.js not found and cannot be installed. Check your Render environment."
  exit 1
fi# Build frontend if present (handles both `frontened` and `frontend` directories)
FRONT_DIR=""
if [ -d "frontened" ]; then
	FRONT_DIR="frontened"
elif [ -d "frontend" ]; then
	FRONT_DIR="frontend"
fi

if [ -n "$FRONT_DIR" ]; then
	echo "Building frontend in \`$FRONT_DIR\`..."
	cd "$FRONT_DIR"
	if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
		npm ci --silent
	else
		npm install --silent
	fi
	# Try to run build; if there's no build script, continue
	if npm run build --silent; then
		echo "Frontend build succeeded"
	else
		echo "No frontend build script or build failed; continuing"
	fi
	cd - >/dev/null
fi

# Prepare backend
echo "Preparing backend..."
cd backend

if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
	npm ci --only=production --silent
else
	npm install --only=production --silent
fi

# Optional: seed database when explicitly requested by environment variable
if [ "${SEED_DB:-false}" = "true" ]; then
	echo "SEED_DB=true -> seeding database (this may exit the script if seed script ends the process)..."
	if [ -f seedDatabase.js ]; then
		node seedDatabase.js
	else
		echo "seedDatabase.js not found; skipping seed"
	fi
fi

echo "Starting backend server (node server.js)..."
exec node server.js

