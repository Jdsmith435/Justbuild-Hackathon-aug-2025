# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Professor Web Scraper project.

## Project Overview

This project is built on the [Mastra Browsing Agent template](https://mastra.ai/templates/browsing-agent) and is specifically configured to scrape professor data from the internet. It combines Browserbase's Stagehand with Mastra for AI-powered web automation and data extraction.

## Template Setup

This project uses the Mastra browsing agent template which provides:

### Core Architecture
- **AI-Powered Web Interactions**: Natural language interface for web automation
- **Automated Browser Sessions**: Smart session management with timeouts and recovery
- **Structured Data Extraction**: Tools for extracting professor information from web pages
- **Multi-Step Navigation**: Ability to navigate complex university websites

### Web Automation Flow
```
User Query ’ Web Agent ’ Stagehand Tools ’ Browser ’ Professor Data ’ Structured Response
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build the project
pnpm run build

# Start production server
pnpm run start
```

## Environment Configuration

Required `.env` variables:
```
BROWSERBASE_PROJECT_ID=your_project_id
BROWSERBASE_API_KEY=your_api_key
OPENAI_API_KEY=your_openai_key
```

## Professor Data Scraping

### Supported Web Actions
- **Navigate to university websites**: Find faculty/professor directories
- **Search for professors**: Use site search or navigation menus
- **Extract professor profiles**: Collect name, department, contact, research areas
- **Handle pagination**: Navigate through multiple pages of professor listings
- **Download content**: Extract CVs, publication lists, or profile images

### Data Extraction Schema
The tools can extract structured data including:
- Professor name and title
- Department/faculty affiliation
- Contact information (email, phone, office)
- Research interests and areas
- Publications and academic background
- Office hours and availability

### Web Agent Instructions
The `webAgent` is configured with specific instructions for:
- Navigating university websites
- Identifying professor directory pages
- Extracting relevant academic information
- Handling different website structures and layouts

## Core Components

### Stagehand Session Manager (`src/lib/stage-hand.ts`)
- Singleton browser session management
- 10-minute session timeout with automatic cleanup
- Session validation and recovery for long-running scraping tasks
- Error handling for expired browser contexts

### Professor Web Agent (`src/mastra/agents/web-agent.ts`)
- OpenAI GPT-4o powered agent
- Specialized for academic website navigation
- Memory integration for multi-step scraping workflows
- Four web automation tools for comprehensive data extraction

### Web Automation Tools (`src/mastra/tools/`)
1. **pageNavigateTool**: Navigate to university websites and professor directories
2. **pageObserveTool**: Identify professor profile links and data elements
3. **pageActTool**: Interact with search forms, pagination, and navigation
4. **pageExtractTool**: Extract structured professor data from pages

## Usage Patterns for Professor Scraping

### Basic Professor Search
```typescript
// Navigate to university faculty page
await pageNavigateTool({ url: "https://university.edu/faculty" })

// Search for specific professor
await pageActTool({ action: "search for professor smith in search box" })

// Extract professor data
await pageExtractTool({ action: "extract professor contact and research info" })
```

### Bulk Faculty Directory Scraping
```typescript
// Navigate to faculty directory
await pageNavigateTool({ url: "https://university.edu/faculty-directory" })

// Observe pagination and professor listings
await pageObserveTool({ action: "find all professor profile links on page" })

// Extract data from multiple profiles
// Handle pagination to get all professors
```

## Technical Notes

- Uses ES modules and TypeScript with ES2022 target
- Browser sessions automatically timeout after 10 minutes of inactivity
- All web interactions use centralized session management for reliability
- Zod schemas validate all tool inputs and outputs
- In-memory storage by default (change to file storage for persistence)

## Best Practices for Professor Data Scraping

- Respect robots.txt and rate limits when scraping university websites
- Handle different university website structures gracefully
- Use specific CSS selectors and text patterns for reliable data extraction
- Implement error handling for missing or malformed professor profiles
- Cache extracted data to avoid re-scraping the same professors