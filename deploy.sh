#!/bin/bash

# WorkTrack Deployment Script
# This script deploys the application to the VPS

set -e  # Exit on error

echo "🚀 Starting WorkTrack deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and configure it"
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down

# Build and start containers
echo -e "${YELLOW}🔨 Building and starting containers...${NC}"
docker-compose up -d --build

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service status
echo -e "${YELLOW}📊 Checking service status...${NC}"
docker-compose ps

# Clean up old images
echo -e "${YELLOW}🧹 Cleaning up old Docker images...${NC}"
docker image prune -af

# Show logs
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${YELLOW}📝 Showing recent logs:${NC}"
docker-compose logs --tail=50

echo ""
echo -e "${GREEN}🎉 WorkTrack is now running!${NC}"
echo -e "Frontend: https://$(grep VIRTUAL_HOST .env | cut -d '=' -f2)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo "To restart: docker-compose restart"
