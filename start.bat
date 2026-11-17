@echo off
title Backend Journey - 32-Week Engineering Companion
echo ====================================================================
echo   Starting Backend Journey - 32-Week Engineering Companion
echo ====================================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Node.js detected. Starting server and launching browser...
    start "" http://127.0.0.1:3000
    node server.mjs
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Node.js not found. Starting with Python HTTP server...
    start "" http://127.0.0.1:8000
    python -m http.server 8000
    goto end
)

echo [ERROR] Neither Node.js nor Python was found on your system PATH.
echo Please install Node.js (v18+) from https://nodejs.org to run the app.
echo.
pause

:end
