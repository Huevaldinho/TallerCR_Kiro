#!/bin/bash

# Taller Pro CR - Development Setup Script
# This script sets up the development environment for new team members

set -e

echo "🚀 Setting up Taller Pro CR development environment..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

# Build Docker containers
echo "🔨 Building Docker containers..."
docker-compose build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run 'make dev' or 'docker-compose up' to start development"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Available commands:"
echo "  make dev          - Start development server"
echo "  make test         - Run tests"
echo "  make supabase     - Start local Supabase (optional)"
echo "  make help         - Show all available commands"
echo ""