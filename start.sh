#!/bin/bash

# Start both backend and frontend
echo "🏌️ Starting Round Receipts..."

# Start backend in background
echo "📍 Starting backend (port 5000)..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "📍 Starting frontend (port 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Round Receipts is running!"
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
