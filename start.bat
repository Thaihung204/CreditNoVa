@echo off
echo ========================================
echo    CREDITNOVA PROJECT LAUNCHER
echo ========================================
echo.

echo [INFO] Checking if required tools are installed...

:: Check if dotnet is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] .NET is not installed or not in PATH
    echo Please install .NET 8.0 SDK from https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

:: Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pnpm is not installed or not in PATH
    echo Please install pnpm: npm install -g pnpm
    pause
    exit /b 1
)

echo [INFO] All required tools are available
echo.

:: Start Backend API
echo [INFO] Starting Backend API (ASP.NET Core)...
echo Backend will be available at: http://localhost:5000
echo Swagger documentation: http://localhost:5000/swagger
echo.
start "CreditNoVa Backend API" cmd /k "cd /d CreditNoVa-API\CreditNoVa-API\CreditNoVa-API && dotnet run"

:: Wait a moment for backend to start
echo [INFO] Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

:: Start Frontend
echo [INFO] Starting Frontend (Next.js)...
echo Frontend will be available at: http://localhost:3000
echo.
start "CreditNoVa Frontend" cmd /k "cd /d CreditNoVa-FE && pnpm dev"

:: Wait a moment for frontend to start
echo [INFO] Waiting 10 seconds for frontend to initialize...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    SERVERS STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Swagger:  http://localhost:5000/swagger
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.

:: Optional: Open browser automatically
set /p openBrowser="Do you want to open the application in browser? (y/n): "
if /i "%openBrowser%"=="y" (
    echo [INFO] Opening browser...
    start http://localhost:3000
    start http://localhost:5000/swagger
)

echo.
echo Press any key to exit this launcher...
pause >nul
