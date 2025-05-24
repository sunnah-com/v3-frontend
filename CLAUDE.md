# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production (works without backend connectivity)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking (if available)
```

## Architecture Overview

This is a Next.js 15 application using the App Router with React 19. The project follows a server-first architecture with ISR (Incremental Static Regeneration) for optimal performance.

### Key Technologies
- **Framework**: Next.js 15.3.0 with App Router
- **UI**: React 19 with shadcn/ui components and Tailwind CSS v4
- **API**: gRPC/Protobuf via ts-proto generated types
- **State Management**: React Context API with custom providers
- **Styling**: Tailwind CSS v4 (PostCSS-based)
- **Telemetry**: Grafana Faro integration

### Data Flow
1. **API Layer**: `src/lib/api-client.ts` provides centralized API communication
2. **Proto Types**: `src/proto/` contains generated TypeScript types from protobuf definitions
3. **Services**: `src/services/` implements business logic using proto types
4. **ISR Data**: `src/lib/isr-data.ts` handles static data fetching with 1-hour revalidation
   - ISR functions include build-time fallbacks that return empty data when API is unavailable
   - This allows builds to succeed in CI/CD environments without backend connectivity
5. **Components**: Server components fetch data directly, client components use contexts/hooks

### Provider Hierarchy
The app wraps components in this order:
1. `AuthProvider` - Authentication state management
2. `TelemetryProvider` - Grafana Faro telemetry
3. `StaticDataProvider` - Collections and languages data
4. Theme provider (via next-themes)

### Authentication
- OAuth support with email/password fallback
- Protected routes via `ProtectedRoute` component
- Auth state managed through `AuthProvider` and `useAuth` hook
- Token storage in cookies with server-side validation

### Important Patterns
- Server Components are preferred for data fetching
- Use `async/await` in server components for API calls
- Client components should use the `"use client"` directive
- ISR revalidation time is set to 3600 seconds (1 hour)
- All API responses follow protobuf-defined structures

### UI Components
- **Sidebar Navigation**: Collections pages use `HadithSidebar` component with sticky trigger
  - Desktop: Collapsible sidebar with icon-only mode
  - Mobile: Slide-out drawer pattern
  - Located in `src/components/hadith-sidebar.tsx`
- **UI Library**: Full shadcn/ui component library in `src/components/ui/`
- **Import Pattern**: Use `fe/` prefix for imports (e.g., `import { Button } from "fe/components/ui/button"`)