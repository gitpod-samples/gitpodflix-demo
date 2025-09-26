#!/bin/bash

set -e

echo "🚀 Starting development environment setup..."

# Verify PostgreSQL client tools are installed (already installed in Dockerfile)
if ! command -v pg_isready &> /dev/null; then
    echo "❌ PostgreSQL client tools not properly installed"
    exit 1
fi

# Install jq if not present (for health checks)
if ! command -v jq &> /dev/null; then
    echo "📦 Installing jq for JSON processing..."
    sudo apt-get update && sudo apt-get install -y jq
fi

# Make scripts executable
chmod +x startup.sh 2>/dev/null || true
chmod +x health-check.sh 2>/dev/null || true

echo "✅ Setup completed successfully!" 

# GitHub CLI authentication (optional)
if [ -n "$GH_CLI_TOKEN" ]; then
    gh auth login --with-token <<< "$GH_CLI_TOKEN"
    gh auth setup-git
else
    echo "ℹ️  GH_CLI_TOKEN not set, skipping authentication"
fi

echo "🔧 Available commands:"
echo "   ./startup.sh      - Start all services"
echo "   ./health-check.sh - Check service health"

echo "✅ Setup completed successfully!"
