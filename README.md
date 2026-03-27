# ScaleX Bot - Delivery Package

This repository contains the complete ScaleX bot codebase and demo site, delivered as part of the Botpress Managed Plan.

## Structure

```
bot/scalex-agent/   # Botpress ADK bot - the core ScaleX assistant
demo/               # React + Vite demo site (deployed on Vercel)
adk-skills/         # Botpress ADK skills for Claude Code
utils/              # Utility scripts (table sync, etc.)
```

## Bot (`bot/scalex-agent/`)

The ScaleX bot is built with the Botpress ADK. It uses a CSV-first architecture with 22 interconnected tables for vendor pricing, SLAs, risk rules, and contract benchmarks.

### Quick Start

```bash
cd bot/scalex-agent
bun install
adk dev
```

See `bot/scalex-agent/CLAUDE.md` for a detailed development guide including architecture, table schemas, and common patterns.

## Demo Site (`demo/`)

A React + Vite frontend with Botpress webchat integration, clause extraction UI, feedback bar, and post-session survey.

### Quick Start

```bash
cd demo
bun install
bun run dev
```

## ADK Skills (`adk-skills/`)

Botpress ADK reference docs for use with Claude Code. Place these in your `~/.claude/skills/adk/` directory so Claude Code can assist with bot development and maintenance.

## Utils

- `sync-tables-to-prod.py` — Script to sync CSV table data to the production bot. If table columns haven't changed, data updates take minutes.

## Updating Bot Data

- **Data only** (same columns): Run the sync script — fast, ~2 min.
- **Schema changes** (new columns, type changes): Requires redefining table schemas, updating query tools, wiping bot tables, and re-uploading. See the bot's `CLAUDE.md` for details.

## Support

For ongoing support, reach out to the Botpress support team. They have a detailed guide on how the project is built and how to navigate the codebase.
