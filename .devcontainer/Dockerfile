# syntax=docker/dockerfile:1.4
FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

# Install system dependencies in a single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspaces/gitpodflix

# Install global dependencies first
RUN npm install -g nodemon

# Create directories for package files
RUN mkdir -p frontend backend/catalog

# Copy package files for dependency caching
COPY frontend/package*.json ./frontend/
COPY backend/catalog/package*.json ./backend/catalog/

# Install dependencies using BuildKit cache
RUN --mount=type=cache,target=/root/.npm \
    cd frontend && npm ci --prefer-offline --no-audit --no-fund && \
    cd ../backend/catalog && npm ci --prefer-offline --no-audit --no-fund

# Copy the rest of the application
COPY . .

# Set the default user
USER node
