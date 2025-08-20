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

# Setup Jira MCP server
echo "🚀 Setting up Jira MCP server..."

# Create config directory
mkdir -p ~/.config/gitpod

# Clone and build Jira MCP if not already present
if [ ! -d "/home/node/jira-mcp" ]; then
  echo "📦 Cloning Jira MCP repository..."
  cd /home/node
  git clone https://github.com/MankowskiNick/jira-mcp.git
  cd jira-mcp
  echo "📦 Installing dependencies..."
  npm install
  echo "🔨 Building project..."
  npm run build
else
  echo "✓ Jira MCP already installed"
fi

# Create MCP configuration file
echo "⚙️ Creating MCP configuration..."
cat > ~/.config/gitpod/mcp-config.json << EOF
{
  "mcpServers": {
    "jira-mcp": {
      "command": "node",
      "args": ["/home/node/jira-mcp/build/index.js"],
      "env": {
        "JIRA_HOST": "${JIRA_HOST:-coakley.atlassian.net}",
        "JIRA_USERNAME": "${JIRA_USERNAME:-joe@gitpod.io}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN:-your_api_token_here}",
        "JIRA_PROJECT_KEY": "${JIRA_PROJECT_KEY:-MBA}",
        "AUTO_CREATE_TEST_TICKETS": "true",
        "JIRA_ACCEPTANCE_CRITERIA_FIELD": "customfield_10429",
        "JIRA_STORY_POINTS_FIELD": "customfield_10040",
        "JIRA_EPIC_LINK_FIELD": "customfield_10014"
      }
    }
  }
}
EOF

echo "✅ Jira MCP server setup complete!"
echo "📍 Configuration: ~/.config/gitpod/mcp-config.json"
echo "📍 Server location: /home/node/jira-mcp/"
echo "🎯 Project: MBA (coakley.atlassian.net)"
