#!/bin/bash

# Simple deployment script for the server
echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install/update dependencies
pnpm install

# Restart PM2 application
pm2 restart neighbor-api

echo "Deployment complete!"
echo "Check status with: pm2 status"
echo "View logs with: pm2 logs neighbor-api"