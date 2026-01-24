#!/bin/bash

# PennyPlanner - Start Both Frontend and Backend

set -e

echo "🚀 Starting PennyPlanner Development Servers"
echo "==========================================="
echo ""

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Kill any existing processes on our ports
echo "🧹 Cleaning up old processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node.*src/index.js" 2>/dev/null || true
sleep 1

# Start Backend
echo "📡 Starting Backend (port 5001)..."
cd "$PROJECT_DIR/backend"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 2

# Start Frontend  
echo "🎨 Starting Frontend (port 3000)..."
cd "$PROJECT_DIR/frontend-pennies"
npm run dev -- --port 3000 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Servers Started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend:  http://localhost:5001"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop servers: pkill -f 'npm run dev' && pkill -f 'node'"
echo ""

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
