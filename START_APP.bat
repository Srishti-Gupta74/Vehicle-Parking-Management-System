@echo off
title Vehicle Parking Management System Launcher
echo ========================================================
echo Starting Vehicle Parking Management System...
echo ========================================================

:: Ensure MySQL service is running
sc query MySQL80 | find "RUNNING" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [0/2] Starting MySQL Database Service...
    net start MySQL80 >nul 2>&1
)

echo [1/2] Launching Spring Boot Java Backend (Port 8080)...
start "VPMS - Spring Boot Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo [2/2] Launching React Vite Frontend (Port 5173)...
start "VPMS - React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for servers to initialize...
timeout /t 6 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo ========================================================
echo System is running!
echo Backend API: http://localhost:8080
echo Frontend UI: http://localhost:5173
echo.
echo Default Admin Credentials:
echo Email:    admin@parking.com
echo Password: admin123
echo ========================================================
