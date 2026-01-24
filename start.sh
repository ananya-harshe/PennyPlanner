#!/bin/bash
# Quick start script for DuoPlanning

echo "🚀 DuoPlanning - Launcher"
echo "=========================="
echo ""
echo "Starting frontend and backend servers..."
echo ""

# Start Backend
echo "📦 Starting Backend on port 5001..."
cd "$(dirname "$0")/backend"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend  
echo "🎨 Starting Frontend on port 3000..."
cd "$(dirname "$0")/frontend-pennies"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo ""
echo "✨ Both servers are running!"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:5001/api"
echo ""
echo "🧪 API Endpoints:"
echo "   • Health:   http://localhost:5001/api/health"
echo "   • Lessons:  http://localhost:5001/api/lessons"
echo "   • Penny:    http://localhost:5001/api/penny/tip"
echo ""
echo "💡 To stop: Press Ctrl+C or run 'pkill npm'"
echo ""

# Keep script running
wait
