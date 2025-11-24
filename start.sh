#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")" || exit 1

echo "=== Starting E-Commerce Backend ==="

# Note: Backend dependencies already installed via Procfile release phase
# Frontend is deployed separately on Netlify

echo "🚀 Starting server..."
cd backend
exec node server.js

