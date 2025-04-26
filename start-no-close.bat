@echo off
echo Starting backend server...
start cmd /k "cd backend && node server.js"
echo Backend server started!

echo Starting frontend server...
start cmd /k "node server.js"
echo Frontend server started!

echo.
echo Servers are now running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3001
echo.
echo Open your browser and navigate to: http://localhost:3001
echo To stop the servers, close the terminal windows or use taskkill /F /IM node.exe 