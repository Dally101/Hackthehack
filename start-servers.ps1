# PowerShell script to start both backend and frontend servers
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "cd backend; npm start"

Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "npm run dev"

Write-Host "Both servers are now running!"
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000" 