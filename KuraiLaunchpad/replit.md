# KURAI Launchpad

## Overview

KURAI is a Solana-compatible token launchpad platform designed to prevent front-running and sniping through fair-launch mechanisms. The platform enables anonymous, privacy-first token launches using SOL mixing, commit-reveal patterns, batch auctions, and auditable escrow vesting for developer allocations. Built with an anime-inspired dark purple and neon teal aesthetic, KURAI prioritizes transparency and fairness in the DeFi launch ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with Vite for development and build tooling

**Routing**: Wouter (lightweight client-side routing)

**UI Component Library**: Radix UI primitives with custom shadcn/ui components styled using Tailwind CSS

**Design System**: 
- Custom KURAI dark theme with deep purple (#1E1436, #2E1B4A) and neon teal (#26E7D7, #3BE8D3) color palette
- CSS variables for theming with HSL color system
- Tailwind CSS for utility-first styling with custom configuration
- Design guidelines emphasize anime aesthetic with glassmorphic cards and gradient overlays

**State Management**: 
- TanStack Query (React Query) for server state and API caching
- React hooks for local component state
- Custom wallet connection state via usePhantomWallet hook

**Key UI Patterns**:
- Card-based layouts with elevated backgrounds and subtle borders
- Gradient overlays and blur effects for depth
- Responsive design with mobile-first considerations
- Toast notifications for user feedback

### Backend Architecture

**Server**: Express.js with TypeScript

**Development Environment**: 
- Vite middleware integration for HMR during development
- Custom logging middleware for API request tracking
- Static file serving for production builds

**Data Layer**:
- In-memory storage implementation (MemStorage) for development
- Interface-based storage design (IStorage) allowing easy swap to persistent storage
- Drizzle ORM configured for PostgreSQL migrations (database not yet provisioned)

**Storage Schema**:
- **Commitments**: Stores commit-reveal hashes with reveal status tracking
- **Sealed Orders**: Batch auction orders with settlement tracking
- **Audit Events**: Immutable log of all launch events (commits, reveals, settlements, escrow releases)
- **Escrows**: Vesting schedule and release tracking for developer funds

**API Design**: RESTful endpoints under `/api` prefix (routes to be implemented)

### Blockchain Integration

**Solana Integration**:
- @solana/web3.js for blockchain interactions
- Connection to Devnet for development, Mainnet for production
- Phantom wallet adapter for user authentication and transaction signing

**Wallet Management**:
- Phantom provider detection and connection handling
- Keypair generation for launch wallets (client-side)
- Private key import/export support (base64 and JSON array formats)
- Balance checking and transaction submission

**Privacy Features**:
- SOL mixing through temporary wallet (currently uses placeholder wallet address)
- Transaction history tracking for mixing operations
- Launch wallet generation separate from user wallet for anonymity

**Anti-Sniping Mechanisms** (UI components built, on-chain contracts are placeholders):
- Commit-reveal flow to prevent parameter front-running
- Sealed order batch auctions for fair price discovery
- Time-locked commitment windows before reveal

### Build & Deployment

**Build Process**:
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Single production command runs compiled Express server serving static frontend

**Development Workflow**:
- `npm run dev`: Runs Express with Vite middleware for HMR
- `npm run build`: Production build of both frontend and backend
- `npm start`: Runs production server
- `npm run db:push`: Drizzle schema push (requires DATABASE_URL)

**Type Safety**: 
- Shared types between client and server via `@shared` path alias
- TypeScript strict mode enabled
- Zod schemas for runtime validation

## External Dependencies

### Core Framework Dependencies

- **React Ecosystem**: react, react-dom, react-router (via wouter)
- **Build Tools**: Vite, esbuild, TypeScript
- **Backend**: Express.js with TypeScript support (tsx runtime)

### Blockchain & Wallet

- **@solana/web3.js**: Solana blockchain interaction library
- **Phantom Wallet**: Browser extension wallet integration (client-side detection)
- **Buffer polyfill**: Required for Solana web3.js in browser environment

### UI Component Libraries

- **Radix UI**: Headless component primitives (@radix-ui/react-*)
  - Includes: dialog, dropdown, popover, tabs, toast, accordion, checkbox, select, and 20+ other primitives
- **shadcn/ui**: Pre-built components using Radix UI + Tailwind
- **Tailwind CSS**: Utility-first CSS framework with custom KURAI theme
- **class-variance-authority**: Type-safe component variant management
- **Lucide React**: Icon library
- **react-icons**: Additional icon set (includes FaXTwitter)

### State & Data Management

- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation and type inference
- **@hookform/resolvers**: Zod integration for React Hook Form

### Database & ORM

- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **drizzle-kit**: Migration and schema management CLI
- **Note**: Database URL must be configured via `DATABASE_URL` environment variable

### Development Tools

- **@replit/vite-plugin-***: Replit-specific development plugins
  - runtime-error-modal: Error overlay
  - cartographer: File navigation
  - dev-banner: Development mode indicator
- **PostCSS & Autoprefixer**: CSS processing

### Session & Storage

- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used)

### Utility Libraries

- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Class name utilities
- **cmdk**: Command palette component
- **nanoid**: Unique ID generation

### Missing/Placeholder Integrations

- **On-chain Smart Contracts**: CommitmentRegistry, BatchAuction, EscrowVesting, LBPController contracts are not implemented (require Anchor/Solidity development)
- **Privacy Mixing Protocol**: Currently uses hardcoded temporary wallet instead of actual mixing protocol
- **PostgreSQL Database**: Configured but not provisioned (using in-memory storage)
- **API Routes**: Backend routes are registered but not implemented (placeholder only)