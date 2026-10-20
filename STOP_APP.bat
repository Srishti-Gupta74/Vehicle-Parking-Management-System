@echo off
title Stop Vehicle Parking Management System
echo ========================================================
echo Stopping Vehicle Parking Management System Servers...
echo ========================================================

echo Stopping Spring Boot backend (Port 8080)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Stopping Vite frontend (Port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo All VPMS servers stopped cleanly.
pause
