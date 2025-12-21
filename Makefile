# Taller Pro CR - Development Commands

.PHONY: help dev build test clean setup

# Default target
help:
	@echo "Taller Pro CR - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development server with Docker"
	@echo "  make dev-local    - Start development server locally (requires Node.js)"
	@echo "  make logs         - Show application logs"
	@echo "  make shell        - Access container shell"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run all tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make test-property - Run property-based tests only"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code with Prettier"
	@echo ""
	@echo "Database:"
	@echo "  make supabase     - Start local Supabase instance"
	@echo "  make supabase-stop - Stop local Supabase instance"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build production image"
	@echo "  make prod         - Run production build"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        - Clean Docker containers and images"
	@echo "  make setup        - Initial project setup"
	@echo "  make update       - Update dependencies"

# Development
dev:
	docker-compose up --build

dev-local:
	npm run dev

dev-detached:
	docker-compose up --build -d

logs:
	docker-compose logs -f app

shell:
	docker-compose exec app sh

# Testing
test:
	docker-compose exec app npm test

test-local:
	npm test

test-watch:
	docker-compose exec app npm run test:watch

test-property:
	docker-compose exec app npm run test:property

lint:
	docker-compose exec app npm run lint

lint-local:
	npm run lint

format:
	docker-compose exec app npm run format

format-local:
	npm run format

# Database
supabase:
	docker-compose --profile local-supabase up -d

supabase-stop:
	docker-compose --profile local-supabase down

# Production
build:
	docker-compose -f docker-compose.prod.yml build

prod:
	docker-compose -f docker-compose.prod.yml up

# Maintenance
clean:
	docker-compose down -v --rmi all
	docker system prune -f

setup:
	@echo "Setting up Taller Pro CR development environment..."
	@echo "1. Copying environment file..."
	@cp .env.example .env.local || echo ".env.local already exists"
	@echo "2. Building Docker containers..."
	@docker-compose build
	@echo "3. Setup complete! Run 'make dev' to start development."

update:
	npm update
	npm audit fix

stop:
	docker-compose down

restart:
	docker-compose restart

# CI/CD
ci:
	npm ci
	npm run type-check
	npm run lint
	npm run test