#!/bin/bash

# Dahab Gold Store POS - Docker Setup Script
echo "🚀 Setting up Dahab Gold Store POS with Docker..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please review and modify if needed."
else
    echo "✅ .env file already exists."
fi

# Build and start the services
echo "🔨 Building Docker containers..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   - Next.js App: http://localhost:3000"
    echo "   - PocketBase Admin: http://localhost:8090/_/"
    echo ""
    echo "🔐 Default PocketBase Admin Credentials:"
    echo "   - Email: admin@dahab.com"
    echo "   - Password: admin123456"
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop services: docker-compose down"
    echo ""
    echo "🎉 Setup complete! Your Dahab Gold Store POS is ready!"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
