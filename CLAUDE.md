# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
cd fe
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a Next.js 15 application using the App Router pattern for a hadith collection website. The codebase is structured as a monorepo with the frontend application in the `/fe` directory.

### Key Technologies
- **Next.js 15.3.0** with App Router and React 19
- **TypeScript** with strict mode
- **Tailwind CSS v4** with CSS variables for theming
- **shadcn/ui** components (New York style)
- **Protocol Buffers** for API type definitions via ts-proto

### Important Patterns

1. **API Integration**: The application uses Protocol Buffers for API communication. API types are generated in `/fe/src/proto/` and should not be manually edited. Frontend types are defined separately in `/fe/src/types/` with mapping functions in `/fe/src/lib/`.

2. **Component Structure**: 
   - UI components from shadcn/ui are in `/fe/src/components/ui/`
   - Custom components are organized by feature (auth, custom)
   - Use the `fe/*` import alias for cleaner imports

3. **State Management**: The app uses React Context for:
   - Authentication (`/fe/src/components/auth/auth-provider.tsx`)
   - Static data (`/fe/src/contexts/static-data-context.tsx`)
   - Telemetry (`/fe/src/components/telemetry-provider.tsx`)

4. **Incremental Static Regeneration**: Static data (collections, etc.) is cached for 1 hour using ISR. See `/fe/src/lib/isr-data.ts`.

5. **Styling**: The app uses Tailwind CSS v4 with CSS variables. Theme toggle is implemented via next-themes. Always use Tailwind classes and follow the existing component patterns.

## Current Development Focus

The codebase recently migrated from an older version and is being enhanced with:
- Sidebar navigation for collections
- Category tabs for organizing content
- Improved UI/UX with shadcn/ui components