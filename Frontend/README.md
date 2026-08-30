# Ledger Dashboard

A small web app for viewing accounts, balances, and transfers on top of a ledger backend.

## Stack

- [TanStack Start](https://tanstack.com/start) (file-based routing, SSR)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching

## Development

Requires Node.js 18+.

```sh
npm install
npm run dev
```

The dev server runs on http://localhost:8080.

## Other scripts

```sh
npm run build      # production build
npm run preview    # preview the production build locally
npm run lint        # eslint
npm run format       # prettier --write
```

## Project structure

- `src/routes/` — file-based routes (see `src/routes/README.md` for conventions)
- `src/pages/`, `src/components/` — page-level and shared UI components
- `src/api/` — API client calls
- `src/hooks/` — data-fetching hooks (accounts, balances, transactions)
- `src/context/AuthContext.jsx` — auth state
