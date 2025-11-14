# Check system status
Write-Host "`n=== NewsBombs System Status ===" -ForegroundColor Cyan

# Check Frontend
Write-Host "`n[Frontend]" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3455" -UseBasicParsing -TimeoutSec 2
    Write-Host "✓ Frontend is running on http://localhost:3455" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend is not running" -ForegroundColor Red
}

# Check Backend
Write-Host "`n[Backend]" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "✓ Backend is running on http://localhost:3001" -ForegroundColor Green
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is not running or database not connected" -ForegroundColor Red
    Write-Host "  Make sure:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL is running" -ForegroundColor White
    Write-Host "  2. Database 'newsbombs' exists" -ForegroundColor White
    Write-Host "  3. Run: cd backend && npm run start:dev" -ForegroundColor White
}

# Check .env file
Write-Host "`n[Configuration]" -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "✓ backend/.env exists" -ForegroundColor Green
} else {
    Write-Host "✗ backend/.env missing - Run setup-backend.ps1" -ForegroundColor Red
}

# Check PostgreSQL
Write-Host "`n[PostgreSQL]" -ForegroundColor Yellow
$pgService = Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}
if ($pgService) {
    Write-Host "✓ PostgreSQL service found: $($pgService.DisplayName)" -ForegroundColor Green
    Write-Host "  Status: $($pgService.Status)" -ForegroundColor Gray
} else {
    Write-Host "⚠ PostgreSQL service not found (may still be running)" -ForegroundColor Yellow
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. If backend not running: cd backend && npm run start:dev" -ForegroundColor White
Write-Host "2. If database not setup: createdb -U postgres newsbombs" -ForegroundColor White
Write-Host "3. Create admin user: cd backend && npm run seed" -ForegroundColor White
Write-Host "4. Access admin: http://localhost:3455/admin/login" -ForegroundColor White

