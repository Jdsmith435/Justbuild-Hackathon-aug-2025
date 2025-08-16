# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Stagehand & Mastra integration project that combines Browserbase's Stagehand with Mastra for AI-powered web automation, scraping, and web interactions. The project enables AI agents to interact with web pages through browser automation.

## Development Commands

```bash
# Database commands (run from root)
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Push schema changes to database
pnpm db:studio      # Open Prisma Studio (database GUI)
pnpm db:reset       # Reset database (force)

# Navigate to the project directory
cd mastra-browser-agent-template/professor-web-scraper

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build the project
pnpm run build

# Start production server
pnpm run start
```

## Environment Setup

Required environment variables in `.env`:
- `DATABASE_URL`: SQLite database path (set to "file:./data.db" at root level)
- `BROWSERBASE_PROJECT_ID`: Browserbase project identifier  
- `BROWSERBASE_API_KEY`: Browserbase API authentication key
- `OPENAI_API_KEY`: OpenAI API key for AI model access

## Architecture Overview

### Core Components

**Mastra Framework** (`src/mastra/index.ts`):
- Main Mastra instance configuration with LibSQL storage (in-memory by default)
- Pino logger for structured logging
- Centralized agent registration

**Stagehand Session Manager** (`src/lib/stage-hand.ts`):
- Singleton pattern for browser session management
- Automatic session timeout (10 minutes) and cleanup
- Session validation and recovery logic
- Error handling for expired or closed browser contexts

**Web Agent** (`src/mastra/agents/web-agent.ts`):
- AI-powered agent using OpenAI's GPT-4o model
- Natural language interface for web automation
- Memory integration for conversation context
- Four specialized tools for web interaction

### Web Automation Tools

Located in `src/mastra/tools/`:

1. **pageNavigateTool** - Navigate to URLs and retrieve page metadata
2. **pageActTool** - Perform actions (clicking, typing, form filling)
3. **pageObserveTool** - Identify and locate elements on web pages
4. **pageExtractTool** - Extract structured data from web pages

All tools use the shared session manager for consistent browser state management.

## Database Schema

**Professor Table** (`prisma/schema.prisma`):
- `id`: Unique identifier (CUID)
- `name`: Professor's full name
- `email`: Contact email address
- `photoUrl`: URL to professor's photo
- `website`: Professor's personal/academic website
- `createdAt`: Record creation timestamp
- `updatedAt`: Last modification timestamp

Database location: `data.db` at repository root level for shared access across projects.

## Key Dependencies

- `@prisma/client`: Database ORM client
- `prisma`: Database toolkit and migration tool
- `@mastra/core`: Core framework for AI agents
- `@browserbasehq/stagehand`: Browser automation through Browserbase
- `@ai-sdk/openai`: OpenAI integration for AI models
- `zod`: Schema validation for tool inputs/outputs

## Development Notes

- The project uses ES modules (`"type": "module"`)
- TypeScript configuration targets ES2022 with bundler module resolution
- Browser sessions automatically timeout after 10 minutes of inactivity
- All web interactions go through the centralized session manager for reliability
- Database is SQLite stored at root level (`data.db`) for shared access across projects
- Prisma client is generated to `generated/prisma/` directory at root level
- Run database commands from repository root, application commands from project subdirectory