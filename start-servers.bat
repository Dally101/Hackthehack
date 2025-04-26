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
echo Press any key to stop both servers.
pause

taskkill /F /IM node.exe
echo All servers stopped. 