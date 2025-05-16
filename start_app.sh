#!/bin/bash

# Start Django backend
cd django_backend
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:3001 &
DJANGO_PID=$!

# Start React frontend
cd ../react_frontend
npm run dev &
REACT_PID=$!

# Handle shutdown
function cleanup {
  echo "Shutting down services..."
  kill $DJANGO_PID
  kill $REACT_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
echo "GitpodFlix is running!"
echo "Django backend: http://localhost:3001"
echo "React frontend: http://localhost:5173"
echo "Press Ctrl+C to stop all services"
wait
