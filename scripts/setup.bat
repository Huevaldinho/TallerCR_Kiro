@echo off
REM Taller Pro CR - Development Setup Script for Windows
REM This script sets up the development environment for new team members

echo 🚀 Setting up Taller Pro CR development environment...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first:
    echo    https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first:
    echo    https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Copy environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local from template...
    copy .env.example .env.local
    echo ⚠️  Please edit .env.local with your Supabase credentials
) else (
    echo ✅ .env.local already exists
)

REM Build Docker containers
echo 🔨 Building Docker containers...
docker-compose build

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your Supabase credentials
echo 2. Run 'docker-compose up' to start development
echo 3. Open http://localhost:3000 in your browser
echo.
echo Available commands:
echo   docker-compose up     - Start development server
echo   npm run docker:dev    - Alternative start command
echo   docker-compose down   - Stop development server
echo.
pause