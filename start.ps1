Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Journey - 32-Week Engineering Companion" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Node.js detected. Starting server and launching browser..." -ForegroundColor Green
    Start-Process "http://127.0.0.1:3000"
    node server.mjs
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "[INFO] Node.js not found. Starting with Python HTTP server..." -ForegroundColor Yellow
    Start-Process "http://127.0.0.1:8000"
    python -m http.server 8000
} else {
    Write-Host "[ERROR] Neither Node.js nor Python was found on PATH." -ForegroundColor Red
    Write-Host "Please install Node.js (v18+) from https://nodejs.org" -ForegroundColor Red
    Pause
}
