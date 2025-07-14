# Fixing Renovate Dependencies Demo

This demo shows how to use Renovate to create pull requests for dependency updates and then use AI assistance to resolve any breaking changes.

## Prerequisites

- Access to a Gitpod environment with this repository
- GitHub CLI token configured (`GH_CLI_TOKEN` environment variable)
- Renovate CLI is pre-installed in the devcontainer

## Steps to Replicate

### 1. Create a Renovate Pull Request

The Renovate CLI is available in this environment and can be used to scan for dependency updates. The repository includes a `renovate.json` configuration that focuses on Jest dependencies.

To create a pull request for dependency updates, you can run:

```bash
# Set the GitHub token for Renovate
export RENOVATE_TOKEN=$GH_CLI_TOKEN

# Run Renovate to scan and create pull requests
renovate --platform=github gitpod-samples/gitpodflix-demo
```

This will:
- Use the existing `renovate.json` configuration
- Scan for dependency updates (currently configured for Jest)
- Create pull requests for available updates
- Target upgrades that may introduce breaking changes

### 2. Review the Pull Request

After the command completes, check the GitHub repository for newly created pull requests. The PRs will contain:
- Updated dependencies
- Changelog information about breaking changes
- Details about what needs to be addressed

### 3. Resolve Breaking Changes with AI

You have several options to get AI assistance for resolving the breaking changes:

#### Option A: Using GitHub CLI
```bash
# Get PR details and diff
gh pr view <PR_NUMBER> --json body,title,files
gh pr diff <PR_NUMBER>

# Use this information to prompt your AI assistant
```

#### Option B: Manual Context Gathering
1. Copy the PR description and diff manually
2. Include relevant test files that might be affected
3. Construct a prompt asking for help with dependency migration

#### Option C: Direct File Analysis
1. Review the failing tests after merging the PR
2. Copy error messages and affected code
3. Ask AI to help fix compatibility issues

## Example AI Prompt

```
I have a dependency upgrade that's causing test failures due to breaking changes. Here are the failing tests and error messages:

[Include test file contents and error messages]

Please help me update the code to be compatible with the new version.
```

## Renovate Configuration

The repository includes a `renovate.json` file that can be customized to target specific dependencies or change update behavior. You can modify this configuration to:
- Target different packages
- Change update frequency
- Adjust PR creation settings
- Enable/disable specific dependency types

## Expected Outcomes

- Pull requests with dependency updates
- Understanding of how to use AI to resolve breaking changes
- Updated code compatible with new dependency versions
- Successful test suite execution after fixes

## Notes for Sales Engineers

- This demonstrates real-world dependency management scenarios
- Shows how AI can assist with breaking changes during upgrades
- Highlights the importance of having good test coverage
- Illustrates the collaborative workflow between automated tools and AI assistance
- Renovate CLI provides flexibility for different scanning and update strategies
