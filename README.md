# Welcome to Battleship Game! 🎮

Hey there new developer! 👋

Welcome to our Battleship game implementation, where we're providing an interactive game experience for conference booths.

We're thrilled you joined, let's get you shipping today!

### At Battleship Game: we ship to production on your first day

We know happy developers that are in flow create better products and ship more value.

At Battleship Game we have **zero 'works on my machine' issues** because of **Gitpod**. Onboarding is **one-click to get a running environment with everything you need to ship new fixes and features today** which is why:

We expect every new developer to **ship to production on their first day**.

## Starting your development environment

1. **Check your email**
   - You should have an email invite to join the organization
   - And a link for your first GitHub issue
2. **Go to the projects catalog**
   - Find it at: [app.gitpod.io/projects](https://app.gitpod.io/projects)
   - Here is every project that you have access to
3. **Open up Battleship Game**
   - Search "Battleship Game" in the list and click **'Create environment'**

And bingo! Now have your first environment up and running—that was easy.

## Making a code change

Now in the top right you can choose your favorite editor, whether that's IntelliJ, VS Code or even Cursor.

Your environment will automatically connect.

Here you have:

- All the source code in your favorite editor
- Your running web server on `localhost:3000`
- Your running ports for your API, database, etc
- All authenticated with your GitHub account
- A powerful environment secure in your corporate network

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
  "name": "Battleship Game Dev Environment",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/warrenbuckley/codespace-features/sqlite:1": {}
  },
  "forwardPorts": [3000, 3001, 5432],
  "postCreateCommand": ".devcontainer/setup.sh",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "mtxr.sqltools",
        "mtxr.sqltools-driver-sqlite",
        "mtxr.sqltools-driver-mysql",
        "bradlc.vscode-tailwindcss"
      ]
    }
  }
}
```

This includes:

1. Dependencies like PostgreSQL and Node.JS
2. Configurations of ports to forward
3. A script for additional dependencies and setup
4. Customizations for your editor

### Automations

Your team have configured automations in `.gitpod/automations.yaml`.

Here's a simplified version of how that looks:

```yaml
services:
  catalog:
    name: "Game Server"
    triggeredBy:
      - postEnvironmentStart
    commands:
      start: |
        cd /workspaces/battleship-game/backend/catalog
        PORT=3001 npx nodemon src/index.ts

tasks:
  seedDatabase:
    name: "Initialize Database"
    description: "Initialize the database with the game_state table"
    triggeredBy:
      - manual
      - postEnvironmentStart
    command: |
      PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -f migrations/02_create_game_state.sql
```

This includes:

- Configurations to start your webservers, databases and microservices
- Automated tasks to initialize your database, run tests, etc

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
