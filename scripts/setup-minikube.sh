#!/bin/bash

set -e

echo "🚀 Setting up Minikube for GitpodFlix..."

# Start Minikube
echo "Starting Minikube..."
minikube start --driver=docker --memory=4096 --cpus=2 --force

# Configure Docker to use Minikube's Docker daemon
echo "Configuring Docker environment..."
eval $(minikube docker-env)

# Build Docker images
echo "Building Docker images..."

echo "Building catalog service..."
cd /workspaces/gitpodflix-demo/backend/catalog
docker build -t catalog-service:latest .

echo "Building frontend..."
cd /workspaces/gitpodflix-demo/frontend
docker build -t frontend:latest .

cd /workspaces/gitpodflix-demo

# Apply Kubernetes manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/catalog-service.yaml
kubectl apply -f k8s/frontend.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres
kubectl wait --for=condition=available --timeout=300s deployment/catalog-service
kubectl wait --for=condition=available --timeout=300s deployment/frontend

echo "✅ Minikube setup complete!"
echo "🔗 Use 'kubectl port-forward' to access services:"
echo "   Frontend: kubectl port-forward service/frontend-service 3000:3000"
echo "   Catalog API: kubectl port-forward service/catalog-service 3001:3001"
echo "   PostgreSQL: kubectl port-forward service/postgres-service 5432:5432"
