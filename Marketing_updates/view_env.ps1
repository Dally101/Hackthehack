# PowerShell script to check the contents of the .env file
# Run this script by typing: ./view_env.ps1

$envPath = Join-Path -Path (Get-Location | Split-Path) -ChildPath ".env"

if (Test-Path $envPath) {
    Write-Host "Contents of .env file in parent directory:"
    Write-Host "----------------------------------------"
    Get-Content $envPath
    Write-Host "----------------------------------------"
} else {
    Write-Host "No .env file found in parent directory: $envPath"
}

# Also check in current directory
$currentEnvPath = Join-Path -Path (Get-Location) -ChildPath ".env"
if (Test-Path $currentEnvPath) {
    Write-Host "`nContents of .env file in current directory:"
    Write-Host "----------------------------------------"
    Get-Content $currentEnvPath
    Write-Host "----------------------------------------"
} else {
    Write-Host "`nNo .env file found in current directory: $currentEnvPath"
}

Write-Host "`nReminder: Your .env file should contain the following variables:"
Write-Host "AZURE_ENDPOINT=https://your-project-endpoint.azure.com"
Write-Host "AZURE_SUBSCRIPTION_ID=your-subscription-id"
Write-Host "AZURE_RESOURCE_GROUP=your-resource-group-name"
Write-Host "AZURE_PROJECT_NAME=your-ai-project-name" 