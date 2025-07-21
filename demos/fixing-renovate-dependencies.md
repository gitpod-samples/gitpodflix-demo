# Fixing Renovate Dependencies Demo

This demo shows how to use Renovate to create pull requests for dependency updates and then use AI assistance to resolve any breaking changes.

## Prerequisites

- Access to a Gitpod environment with this repository
- GitHub CLI token configured (`GH_CLI_TOKEN` environment variable)
- Renovate CLI installed (included in the devcontainer)

## Steps to Replicate

### 1. Create a Renovate Pull Request

Navigate to the catalog service directory and run the renovate Jest command:

```bash
cd backend/catalog
npm run renovate:jest
```

This command will:
- Use the Jest-specific `renovate-jest-only.json` configuration
- Create a pull request specifically for Jest dependency updates (if one doesn't already exist)
- Target Jest upgrades that may introduce breaking changes
- Only process Jest-related dependencies, ignoring all others

**Note**: If a Jest PR already exists (like PR #57), the command won't create a duplicate. You can use the existing PR for the demo.

### 2. Review the Pull Request

Check the GitHub repository for the Jest pull request (e.g., PR #57 "chore(deps): update dependency jest to v30"). The PR will contain:
- Updated Jest dependencies from v29 to v30
- Detailed changelog showing breaking changes, including:
  - **Removal of deprecated matcher aliases** like `.toBeCalled()`, `.toBeCalledWith()`, etc.
  - Other breaking changes that may affect your tests

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
3. Construct a prompt asking for help with Jest migration

#### Option C: Direct File Analysis
1. Review the failing tests after merging the PR
2. Copy error messages and affected code
3. Ask AI to help fix the deprecated Jest matchers

## Example AI Prompt

```
I have a Jest upgrade from v29 to v30 that's causing test failures due to deprecated matchers. Here are the failing tests:

[Include test file contents and error messages]

The breaking change removes these deprecated matcher aliases:
- .toBeCalled() → should be .toHaveBeenCalled()
- .toBeCalledWith() → should be .toHaveBeenCalledWith()
- .toBeCalledTimes() → should be .toHaveBeenCalledTimes()
- .toReturnWith() → should be .toHaveReturnedWith()
- .toThrowError() → should be .toThrow()

Please help me update the deprecated Jest matchers to their v30 equivalents.
```

## Renovate Configuration

The repository includes two renovate configurations:
- `renovate.json` - General renovate configuration
- `renovate-jest-only.json` - Jest-specific configuration that:
  - Only processes Jest and @types/jest packages
  - Ignores all other dependencies
  - Always recreates PRs when run
  - Has no rate limits for demo purposes

## Expected Outcomes

- A pull request with Jest dependency updates
- Understanding of how to use AI to resolve breaking changes
- Updated test files with Jest v30 compatible syntax
- Successful test suite execution after fixes

## Notes for Sales Engineers

- This demonstrates the real-world scenario of dependency management
- Shows how AI can assist with breaking changes during upgrades
- Highlights the importance of having good test coverage
- Illustrates the collaborative workflow between automated tools and AI assistance
- The Jest v30 upgrade specifically removes deprecated matchers, making it perfect for demonstrating AI-assisted code migration
