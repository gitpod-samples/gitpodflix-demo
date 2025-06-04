# GitpodFlix - Kubernetes Setup

This repository has been converted to use Minikube and Kubernetes for running all services instead of direct Docker containers.

## Architecture

The application now runs on Kubernetes with the following components:

- **PostgreSQL Database**: Runs as a Kubernetes deployment with persistent storage
- **Catalog Service**: Node.js/Express API service running in Kubernetes
- **Frontend**: React application served by Nginx, running in Kubernetes

## Quick Start

1. **Start the environment**: The Minikube cluster will automatically start when the environment loads
2. **Setup services**: Run the "Setup Minikube" task to initialize everything
3. **Start port forwards**: Run the "Start Port Forwards" task to access services locally
4. **Seed database**: Run the "Seed Database" task to populate with sample data

## Manual Commands

### Start Minikube and Deploy Services
```bash
./scripts/setup-minikube.sh
```

### Access Services Locally
```bash
# Frontend (React app)
kubectl port-forward service/frontend-service 3000:3000

# Catalog API
kubectl port-forward service/catalog-service 3001:3001

# PostgreSQL Database
kubectl port-forward service/postgres-service 5432:5432
```

### Check Status
```bash
# Minikube status
minikube status

# All Kubernetes resources
kubectl get all

# Pod logs
kubectl logs deployment/postgres
kubectl logs deployment/catalog-service
kubectl logs deployment/frontend
```

### Rebuild and Redeploy
```bash
# Configure Docker to use Minikube's daemon
eval $(minikube docker-env)

# Rebuild images
cd backend/catalog && docker build -t catalog-service:latest .
cd frontend && docker build -t frontend:latest .

# Restart deployments to use new images
kubectl rollout restart deployment/catalog-service
kubectl rollout restart deployment/frontend
```

## Kubernetes Manifests

- `k8s/postgres.yaml`: PostgreSQL database with persistent volume
- `k8s/catalog-service.yaml`: Backend API service
- `k8s/frontend.yaml`: Frontend React application

## Automation Tasks

The following automation tasks are available:

### Services
- **Minikube Cluster**: Starts/stops the entire Kubernetes cluster
- **PostgreSQL Port Forward**: Port forwards PostgreSQL (manual trigger)
- **Catalog Service Port Forward**: Port forwards the API service (manual trigger)
- **Frontend Port Forward**: Port forwards the frontend (manual trigger)

### Tasks
- **Setup Minikube**: Initialize cluster and deploy all services
- **Start Port Forwards**: Start all port forwards for local access
- **Stop Port Forwards**: Stop all port forwards
- **Seed Database**: Populate database with sample movies
- **Clear Database**: Remove all data from database
- **Show Kubernetes Status**: Display cluster and resource status
- **Open Demo Ports**: Configure Gitpod port forwarding

## Development Workflow

1. Make changes to your code
2. Rebuild the relevant Docker image:
   ```bash
   eval $(minikube docker-env)
   cd backend/catalog && docker build -t catalog-service:latest .
   # or
   cd frontend && docker build -t frontend:latest .
   ```
3. Restart the deployment:
   ```bash
   kubectl rollout restart deployment/catalog-service
   # or
   kubectl rollout restart deployment/frontend
   ```

## Troubleshooting

### Services not starting
```bash
# Check pod status
kubectl get pods

# Check pod logs
kubectl logs <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>
```

### Port forwards not working
```bash
# Stop all port forwards
pkill -f "kubectl port-forward"

# Start specific port forward
kubectl port-forward service/frontend-service 3000:3000
```

### Minikube issues
```bash
# Restart Minikube
minikube stop
minikube start --driver=docker --memory=4096 --cpus=2

# Reset Minikube (nuclear option)
minikube delete
minikube start --driver=docker --memory=4096 --cpus=2
```
