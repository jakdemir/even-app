# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Even** is a Splitwise-style expense sharing app built as a World App Mini App. Users create groups, track shared expenses, and settle debts using World App wallet credentials.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm test         # Run all Jest tests
npm run test:watch  # Run tests in watch mode
```

Run a single test file:
```bash
npx jest lib/debt.test.ts
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: Supabase (PostgreSQL) with realtime subscriptions
- **Auth**: World ID / Wallet Auth via `@worldcoin/minikit-js`
- **Styling**: Tailwind CSS v4

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `app/app/page.tsx` - Main application UI (expense list, debts, settle up)
- `app/api/` - Backend endpoints (SIWE auth: nonce generation, signature verification)
- `components/` - Reusable UI components
- `contexts/ExpenseContext.tsx` - Global state: expenses, groups, user auth, Supabase sync
- `lib/debt.ts` - Debt calculation algorithm (greedy matching to minimize transactions)
- `types/index.ts` - TypeScript interfaces (Expense, Group, GroupMember)

### State Management
`ExpenseContext` is the central state provider:
- Manages expenses, groups, current user, display name
- Syncs with Supabase and subscribes to realtime updates
- Handles localStorage persistence for user session

### Authentication Flow
1. User initiates wallet auth via `AuthButton` component
2. `/api/nonce` generates and stores SIWE nonce in httpOnly cookie
3. MiniKit handles wallet signature
4. `/api/complete-siwe` verifies signature and returns wallet address
5. User profile stored/retrieved from Supabase `users` table

### Data Model
- `users` - wallet_address (PK), display_name
- `groups` - id, name, created_by
- `group_members` - group_id, user_id (join table)
- `expenses` - id, description, amount, payer, group_id, type (expense|payment), splits

### Expense Types
- `expense` - Shared cost with configurable splits (equal, unequal, percentage)
- `payment` - Direct transfer between two users (settlement)

## Environment Variables

Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_APP_ID` - World App ID

## Mini App Constraints

This app runs inside World App WebView. Mobile-first responsive design is critical. Eruda is included for in-app debugging.
