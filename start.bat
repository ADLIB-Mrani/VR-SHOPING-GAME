@echo off
REM Quick start script for VR Shopping Game (Windows)

echo ========================================
echo   VR Shopping Game - Quick Start
echo ========================================
echo.

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm found
    echo Starting with npm...
    npm start
    goto :end
)

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python found
    echo Starting with Python...
    echo Open your browser at: http://localhost:8080
    REM Try Python 3 http.server first, fall back to Python 2 if needed
    python -m http.server 8080 2>nul || python -m SimpleHTTPServer 8080
    goto :end
)

REM Check if PHP is available
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP found
    echo Starting with PHP...
    echo Open your browser at: http://localhost:8080
    php -S localhost:8080
    goto :end
)

REM No server found
echo [ERROR] No suitable server found!
echo.
echo Please install one of the following:
echo   - Node.js (npm)
echo   - Python
echo   - PHP
echo.
echo Or simply double-click index.html to open in your browser.
pause
goto :end

:end
