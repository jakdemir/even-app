# Even App - GEMINI Context

## Project Overview

**Even** is a "Splitwise-style" expense sharing application built as a **World App Mini App**. It allows users to create groups, track shared expenses, and settle debts using their World App wallet credentials.

### Key Features
*   **Groups:** Create and manage expense groups.
*   **Expenses:** Add expenses with support for equal, unequal, and percentage splits.
*   **Settlement:** Record payments and view "who owes who" summaries.
*   **World App Integration:** Uses `MiniKit` for wallet-based authentication and identity.
*   **Recurring Expenses:** (Planned/In-progress) Support for daily, weekly, monthly recurrence.

## Technology Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **UI/Styling:** React 19, Tailwind CSS v4, Lucide React (Icons)
*   **Database:** Supabase (PostgreSQL)
*   **Authentication:** World ID / Wallet Auth via `@worldcoin/minikit-js`
*   **State Management:** React Context (`ExpenseContext`)
*   **Testing:** Jest, React Testing Library
*   **Tooling:** ESLint, Prettier (implied), Eruda (mobile debugging)

## Project Structure

*   `app/` - Next.js App Router pages and API routes.
    *   `api/` - Backend endpoints (e.g., SIWE auth, nonce generation).
    *   `layout.tsx` - Root layout, wraps app in `MiniKitProvider`, `ExpenseProvider`, and `ErudaProvider`.
*   `components/` - Reusable UI components (Forms, Lists, Modals).
*   `contexts/` - Global state management (e.g., `ExpenseContext.tsx`).
*   `lib/` - Utility functions, Supabase client, and business logic (e.g., `debt.ts` for calculation logic).
*   `types/` - TypeScript interface definitions (`Expense`, `Group`, `GroupMember`).
*   `scripts/` - Utility scripts (e.g., `enhance-logging.sh`).
*   `supabase_schema.sql` - Database schema definition.

## Building and Running

### Prerequisites
*   Node.js (v18+ recommended)
*   Supabase Project (for database)

### Environment Setup
Create a `.env.local` file with the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_ID=your_world_app_id
# Other specific World App or SIWE variables as needed
```

### Commands
*   **Development:** `npm run dev` (Starts server on localhost:3000)
*   **Build:** `npm run build`
*   **Start Production:** `npm start`
*   **Test:** `npm test`
*   **Lint:** `npm run lint`

## Development Conventions

*   **Mini App Constraint:** The app is designed to run inside the World App WebView and Worldcoin Super APP. Responsive design and mobile-first approach are critical.
*   **Supabase:** Uses `@supabase/supabase-js` for client-side data fetching. RLS (Row Level Security) policies should be enabled in production.
*   **Debugging:** `Eruda` is included for debugging directly within the mobile WebView context.
*   **Logging:** Check `LOGGING_GUIDE.md` and `SERVER_LOGGING.md` for specific logging standards.
*   **Testing:** Jest is configured. Run tests before pushing changes.

## Database Schema (Simplified)
*   `users` (wallet_address, display_name)
*   `groups` (id, name, created_by)
*   `group_members` (group_id, user_id)
*   `expenses` (id, amount, payer, group_id, splits, type, etc.)
*   `settlements` (implied/calculated or explicit payment records)

For detailed schema, refer to `supabase_schema.sql` and `README_SUPABASE.md`.
