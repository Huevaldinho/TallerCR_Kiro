#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
# Wait for PostgreSQL to be ready
until pg_isready -h postgres -U ${POSTGRES_USER:-taller} -d ${POSTGRES_DB:-taller_cr}; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 1
done

echo "✅ Database is ready"

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npx prisma db seed || true

echo "✅ Database setup complete"

echo "🚀 Starting development server..."
exec npm run dev
