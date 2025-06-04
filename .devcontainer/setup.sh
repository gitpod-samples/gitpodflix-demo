#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Kubernetes development environment setup..."

# Function to handle package installation
install_package() {
    local package=$1
    echo "📦 Installing $package..."
    if ! dpkg -l | grep -q "^ii  $package "; then
        DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends "$package"
    else
        echo "✅ $package is already installed"
    fi
}

# Clean apt cache and update package lists
echo "🧹 Cleaning apt cache..."
apt-get clean
echo "🔄 Updating package lists..."
apt-get update

# Install system dependencies
echo "📦 Installing system dependencies..."
install_package "postgresql-client"
install_package "net-tools"

# Verify PostgreSQL client tools are installed
if ! command -v pg_isready &> /dev/null; then
    echo "❌ PostgreSQL client tools not properly installed"
    exit 1
fi

# Verify Kubernetes tools are available
echo "🔍 Verifying Kubernetes tools..."
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found"
    exit 1
fi

if ! command -v minikube &> /dev/null; then
    echo "❌ minikube not found"
    exit 1
fi

echo "✅ Kubernetes tools verified"

# Install global npm packages
echo "📦 Installing global npm packages..."
npm install -g nodemon

# Install project dependencies
echo "📦 Installing project dependencies..."

# Install Gitpod Flix dependencies
if [ -d "/workspaces/gitpodflix-demo/frontend" ]; then
    echo "📦 Installing Gitpod Flix dependencies..."
    cd /workspaces/gitpodflix-demo/frontend
    npm install
fi

# Install catalog service dependencies
if [ -d "/workspaces/gitpodflix-demo/backend/catalog" ]; then
    echo "📦 Installing catalog service dependencies..."
    cd /workspaces/gitpodflix-demo/backend/catalog
    npm install
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x /workspaces/gitpodflix-demo/scripts/*.sh

echo "✅ Kubernetes development environment setup completed successfully!"
echo "🎯 Next steps:"
echo "   1. Run 'Setup Minikube' task to initialize the cluster"
echo "   2. Run 'Start Port Forwards' task to access services"
echo "   3. Run 'Seed Database' task to populate with sample data"
