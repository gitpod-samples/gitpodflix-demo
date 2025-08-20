# GitpodFlix 🎬

A modern streaming platform demo built for Gitpod environments, showcasing a full-stack application with React frontend, Node.js backend, and PostgreSQL database.

## Features

- 🎥 Movie catalog with search and filtering
- 🔍 Advanced search with full-text capabilities
- 📱 Responsive design with Tailwind CSS
- 🚀 Fast development with Vite

## Jira MCP Integration

This Gitpod environment includes an automated Jira MCP (Model Context Protocol) server setup that allows AI assistants to interact with Jira for project management tasks.

### Automated Setup

The Jira MCP server automatically installs and configures on environment startup:
- Clones from https://github.com/MankowskiNick/jira-mcp
- Installs to `/home/node/jira-mcp/`
- Creates configuration at `~/.config/gitpod/mcp-config.json`
- Pre-configured for coakley.atlassian.net MBA project

### Available Tools

The MCP server provides the following tools:
- **create-ticket**: Create new Jira tickets with summary, description, acceptance criteria, and issue type
- **get-ticket**: Retrieve details of existing Jira tickets
- **search-tickets**: Search for tickets by issue type and additional criteria
- **update-ticket**: Update existing tickets with new field values
- **link-tickets**: Link tickets together with specified relationship types
- **get-test-steps**: Retrieve test steps from Zephyr test tickets
- **add-test-steps**: Add test steps to test tickets via Zephyr integration

### Configuration Status

✅ **AUTOMATED SETUP CONFIGURED**

The Jira MCP integration is now configured to automatically install and configure on every environment startup:

#### Automatic Installation
- **Devcontainer Setup**: Jira MCP installs during `.devcontainer/setup.sh`
- **Gitpod Automations**: Additional automation task available via `setupJiraMCP`
- **Configuration**: Auto-creates `~/.config/gitpod/mcp-config.json`

#### Current Configuration
- **Jira Instance**: coakley.atlassian.net
- **User**: joe@gitpod.io  
- **Project**: MBA (Team #1 Issues)
- **Server Location**: `/home/node/jira-mcp/`
- **Config File**: `~/.config/gitpod/mcp-config.json`

### Test Results

✅ Connection to Jira instance verified  
✅ Authentication successful  
✅ MCP server responds correctly  
✅ Automation setup tested and working
✅ Configuration persists across environment restarts

### Usage

The MCP server automatically installs on environment startup and is ready to use with AI assistants that support the Model Context Protocol. You can:
- Create tickets in the MBA project
- Search existing tickets  
- Update ticket information
- Link tickets together

### Startup Process

When a new environment starts:
1. `.devcontainer/setup.sh` runs automatically
2. Jira MCP repository is cloned to `/home/node/jira-mcp/`
3. Dependencies are installed and project is built
4. MCP configuration file is created with credentials
5. Server is ready for use by AI assistants

### Manual Testing

To test the server manually:
```bash
cd ~/jira-mcp
export JIRA_HOST="coakley.atlassian.net" JIRA_USERNAME="joe@gitpod.io" JIRA_API_TOKEN="..." JIRA_PROJECT_KEY="MBA"
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "search-tickets", "arguments": {"issue_type": "Task", "max_results": 5}}}' | node build/index.js
```
- 🐳 Containerized PostgreSQL database
- 🔄 Real-time updates and suggestions
- ⚡ Automatic service startup and health monitoring

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS (Port 3000)
- **Backend**: Node.js + Express + TypeScript (Port 3001)
- **Database**: PostgreSQL 15 with full-text search (Port 5432)
- **Development**: Hot reload, automated setup, health checks

## Quick Start

### Automatic Startup ✨
The environment automatically starts all services when opened:

1. **Wait for initialization** (30-60 seconds)
2. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Health Check**: http://localhost:3001/health

### Manual Control 🔧
```bash
# Start all services
./startup.sh

# Check service health
./health-check.sh

# Restart if needed
./startup.sh
```

## Service Status

Check if all services are running:

```bash
./health-check.sh
```

Expected output:
```
🔍 GitpodFlix Health Check
==========================
[SUCCESS] PostgreSQL: ✅ Connected (18 movies in database)
[SUCCESS] Backend API: ✅ http://localhost:3001 (Status: OK)
[SUCCESS] Frontend: ✅ http://localhost:3000 (Gitpod Flix)
[SUCCESS] Movies API: ✅ /api/movies (18 movies)
[SUCCESS] Search API: ✅ /api/search (1 results for 'dark')

📊 Health Check Summary
======================
[SUCCESS] All services are healthy! 🎉
```

## Development

### Project Structure
```
├── frontend/          # React frontend application
├── backend/catalog/   # Node.js API service
├── database/main/     # PostgreSQL setup and migrations
├── .devcontainer/     # Development container configuration
├── .gitpod/          # Gitpod automation configuration
├── startup.sh        # 🚀 Service startup script
├── health-check.sh   # 🔍 Health monitoring script
└── README.md         # This file
```

### API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/search` - Search movies with filters
- `GET /api/suggestions` - Get search suggestions
- `POST /api/movies/seed` - Seed database with sample data
- `GET /health` - Service health check

### Database Schema

The PostgreSQL database includes:
- Full-text search capabilities
- Movie metadata (genres, cast, director, etc.)
- Optimized indexes for search performance
- Sample movie data with complete metadata

## Troubleshooting

### Quick Diagnostics
```bash
# Check all services
./health-check.sh

# Restart all services
./startup.sh
```

### Service Logs
```bash
# Database logs
docker logs main-postgres-1

# Backend logs
tail -f /tmp/catalog.log

# Frontend logs
tail -f /tmp/frontend.log
```

### Manual Service Management
```bash
# Database
cd database/main && docker-compose up -d

# Backend
cd backend/catalog && npm run dev

# Frontend
cd frontend && npm run dev
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port conflicts** | Services automatically kill existing processes |
| **Database not ready** | Wait 30s, then run `./health-check.sh` |
| **Missing dependencies** | Run `npm install` in respective directories |
| **Environment variables** | Check `.env` file in `backend/catalog/` |
| **Services not starting** | Run `./startup.sh` to restart all |

## Features Demo

### Search Functionality
- Full-text search across titles, descriptions, and directors
- Genre filtering (Action, Drama, Sci-Fi, etc.)
- Year range filtering (1970-2024)
- Rating and duration filters
- Real-time search suggestions

### Movie Catalog
- Responsive grid layout
- Movie posters and metadata
- Sorting by rating, year, and relevance
- Pagination support
- 18 sample movies with complete metadata

### API Features
- RESTful API design
- Advanced PostgreSQL queries with full-text search
- Error handling and validation
- Health monitoring endpoints
- Automatic database seeding

## Development Tools

- **VS Code Extensions**: Pre-configured for TypeScript, React, and PostgreSQL
- **Hot Reload**: Both frontend and backend support hot reloading
- **Database Tools**: SQLTools extension for database management
- **Linting**: ESLint and Prettier configured
- **Git Integration**: GitHub CLI and Git configured
- **Health Monitoring**: Automated service health checks

## Environment Configuration

The development environment includes:
- ✅ Node.js 18+ with npm
- ✅ PostgreSQL 15 client tools
- ✅ Docker for database containerization
- ✅ All necessary VS Code extensions
- ✅ Automated port forwarding (3000, 3001, 5432)
- ✅ Health monitoring and logging
- ✅ Automatic service startup on environment start

## Contributing

1. Make changes to the codebase
2. Test with `./health-check.sh`
3. Services automatically restart on file changes
4. Commit changes with descriptive messages

## License

This project is a demonstration application for Gitpod environments.
    * And a link for your first GitHub issue
3. **Go to the projects catalog**
    * Find it at: [app.gitpod.io/projects](https://app.gitpod.io/projects)
    * Here is every project in GitpodFlix that you have access to
5. **Open up GitpodFlix**
    * Search "GitpodFlix" in the list and click **'Create environment'**

And bingo! Now have your first environment up and running—that was easy.

![GitpodFlix in the projects catalog](./images/gitpodflix-loading.png)

See above you now have:

1. A personal, isolated, secure, performant development environment
1. All required source code cloned and authenticated with git
1. Any secrets and access credentials installed ready-to-go
1. Your database, microservices and web server running (via "automations")
1. All your dependencies installed from node to sqlite

## Making a code change

Now in the top right you can choose your favorite editor, whether that's IntelliJ, VS Code or even Cursor.

![Choose your editor](./images/choose-your-editor.png)

Your environment will automatically connect.

![Environment open](./images/environment-open.png)

Here you have:

- All the source code in your favorite editor
- Your running web server on `localhost:3000`
- Your running ports for your API, database, etc
- All authenticated with your GitHub account
- A powerful environment secure in your corporate network

> **Tip:** Let's rename "Gitpod Flix" to our name by updating `frontend/src/components/Navbar.jsx`. <br/> Watch the web server live reload the change.

Now you're officially **ready-to-code**.

### Explore your development environment

Now you're setup why not explore:

1. Running a database clear and seed "automation" from the Gitpod UI
2. Connecting to your environment with the CLI `gitpod environment ssh`
3. Adding dotfiles for your personal preferences

## ✨ How does this Gitpod magic work?

### Dev Container

All of the dependencies are defined in the `devcontainer.json` file. Your platform team has configured a base image with all of your platform tooling ready to go. Any time platform tooling updates the next environment you open will automatically have the latest tooling.

Here's a simplified version of how that looks:

```json
{
  "name": "GitpodFlix Dev Environment",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/warrenbuckley/codespace-features/sqlite:1": {}
  },
  "forwardPorts": [
    3000,
    ...
  ],
  "postCreateCommand": ".devcontainer/setup.sh",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        ...
      ]
    }
  }
}
```

This includes:

1. Dependencies like SQLite and Node.JS
2. Configurations of ports to forward
3. A script for additional dependencies and setup
4. Customizations for your editor

### Automations

Your team have configured automations in `.gitpod/automations.yaml`.

Here's a simplified version of how that looks:

```yaml
services:
  catalog:
    name: "GitpodFlix Web Server"
    triggeredBy:
      - postEnvironmentStart
    commands:
      start: |
        cd /workspaces/gitpodflix-demo/frontend
        PORT=3001 npx nodemon src/index.ts

tasks:
  seedDatabase:
    name: "Seed Database"
    description: "Seed the database with sample movies in a dramatic sequence"
    triggeredBy:
      - manual
      - postEnvironmentStart
    command: |
      PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -f seeds/movies_complete.sql
```

This includes:

- Configurations to start your webservers, databases and microservices
- Automated tasks to seed your database, run tests, etc

All of these are setup to be self-serve and automatically configured. **If anything ever breaks, simply delete your environment and create a new one.**

## FAQs

### Where is my environment running? 

Environments run locally or remotely for different projects with different needs. 

### Can I run multiple environment at once?

Yes. The platform team have set policies to manage cost of remote environments. 

### Can I clone multiple repositories?

Yes.

### Can I customize my environment?

Yes, with dotfiles. 

### Can environments run locally? 

Yes for some projects with lower security requirements—but not for others. 

### What happens if the environment stops?

Your code is saved—simply restart to continue working.

### Can I connect via SSH for Vim, etc?

Yes via the Gitpod CLI.

### How do I increase my machine size?

Projects are configured with a specific machine size that's perfect to use. 
