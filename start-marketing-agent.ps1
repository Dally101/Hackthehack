# PowerShell script to start the Hackathon Management System with Marketing Agent

Write-Host "Starting Hackathon Management System with Marketing Agent..." -ForegroundColor Green

# Set environment variables
$env:FLASK_PORT = 5000
$env:MARKETING_AGENT_PORT = 5001
$env:NODE_ENV = "development"

# Start the Marketing Agent
Write-Host "Starting Marketing Agent on port $env:MARKETING_AGENT_PORT..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd $PSScriptRoot; python app.py --port=$env:MARKETING_AGENT_PORT"

# Wait for Marketing Agent to initialize
Write-Host "Waiting for Marketing Agent to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd $PSScriptRoot; npm run dev"

# Wait for development server to initialize
Write-Host "Waiting for development server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start the Express server for API proxy
Write-Host "Starting Express server for API proxy..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd $PSScriptRoot; npm run start"

# All services started
Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "Access the application at http://localhost:3001" -ForegroundColor Magenta
Write-Host "Access the Marketing Agent directly at http://localhost:$env:MARKETING_AGENT_PORT" -ForegroundColor Magenta
Write-Host "`nPress Enter to close this window (services will continue running)..." -ForegroundColor Yellow
$null = Read-Host 