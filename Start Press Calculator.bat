@echo off
rem Double-click to start Press Calculator on this PC.
rem Keep this window open while you use the app; close it to stop the app.
title Press Calculator
cd /d "%~dp0"

echo.
echo  ===========================================
echo    PRESS CALCULATOR  -  starting, please wait
echo  ===========================================
echo.

if not exist node_modules (
  echo  First run: installing packages...
  call npm install || goto :error
)

call npm run build || goto :error

echo.
echo  -------------------------------------------
echo   On this PC:   http://localhost:3000
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { '   On phone (same Wi-Fi):   http://' + $_.IPAddress + ':3000' }"
echo  -------------------------------------------
echo   Keep this window open. Close it to stop.
echo.

start "" http://localhost:3000
call npx next start -H 0.0.0.0 -p 3000
goto :eof

:error
echo.
echo  Something went wrong. Please send a screenshot of this window.
pause
