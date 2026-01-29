# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Inciteful is a Vue 3 web application for exploring academic literature using citation graph analysis. The frontend communicates with a backend API at `api.inciteful.xyz` to query paper graphs using SQL-like syntax.

## Agent Artifacts

All agent-generated artifacts (plans, analysis files, temporary outputs) should be created in the `.agent` directory.

## Commands

- `npm run dev` - Start development server on port 8081
- `npm run build` - Build for production (runs sitemap generation first)
- `npm run lint` - Run ESLint
- `npx vue-tsc --noEmit` - Type check without emitting

## Architecture

### API Layer
- `src/utils/incitefulApi.ts` - Primary API client for the Inciteful backend. Includes rate limiting (max 100 concurrent requests), automatic retries, and endpoints for paper queries, searching, and bibliography export.
- `src/utils/openalexApi.ts` - Secondary API for OpenAlex autocomplete fallback.

### Core Features
- **Paper Discovery** (`/p/:id`) - Main feature. Builds a citation graph from a seed paper and runs SQL queries against it to find similar papers, important papers, review papers, etc.
- **Literature Connector** (`/c`) - Finds citation paths between two papers (Six Degrees of Kevin Bacon for papers).
- **Literature Review** (`/p`) - Multi-paper graph builder for comprehensive literature reviews.
- **SQL Query Interface** (`/p/q`) - Raw SQL queries against paper graphs.

### Dashboard Templates
Dashboard views are defined in YAML files (`src/dashboard_templates/`) containing SQL queries that run against the paper graph. The `{{filters}}` placeholder is replaced with user-selected keyword filters at runtime.

### Graph Visualization
Uses Cytoscape.js for rendering citation networks:
- `src/utils/graphing/graph.ts` - Base graph utilities
- `src/utils/graphing/connector.ts` - Connection path visualization
- `src/utils/graphing/similar.ts` - Similar paper graph
- `src/components/GraphView.vue` - Main graph component

### Type Definitions
- `src/types/incitefulTypes.ts` - Paper, Author, PaperConnector, query result types
- `src/types/graphTypes.ts` - Cytoscape graph types

### Key Patterns
- Path alias: `@/` maps to `src/`
- Event bus: Uses mitt (`src/utils/emitHelpers.ts`) for cross-component communication
- SEO: `@unhead/vue` for meta tags (`src/utils/seo.ts`, `src/utils/pagedata.ts`)
- Lazy loading: Routes use dynamic imports for code splitting

### Styling
- Tailwind CSS with `@tailwindcss/forms` plugin
- Custom component styles in `src/assets/`
