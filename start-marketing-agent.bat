@echo off
echo Starting Hackathon Management System with Marketing Agent...

REM Set environment variables
set FLASK_PORT=5000
set MARKETING_AGENT_PORT=5001
set NODE_ENV=development

echo Starting Marketing Agent on port %MARKETING_AGENT_PORT%...
start cmd /k "cd %~dp0 && python app.py --port=%MARKETING_AGENT_PORT%"

echo Waiting for Marketing Agent to initialize...
timeout /t 5 /nobreak > nul

echo Starting development server...
start cmd /k "cd %~dp0 && npm run dev"

echo Waiting for development server to initialize...
timeout /t 5 /nobreak > nul

echo Starting Express server for API proxy...
start cmd /k "cd %~dp0 && npm run start"

echo All services started!
echo.
echo Access the application at http://localhost:3001
echo Access the Marketing Agent directly at http://localhost:%MARKETING_AGENT_PORT%
echo.
echo Press any key to close this window (services will continue running)...
pause > nul 