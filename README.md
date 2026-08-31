# 💸 Ledgerly

A small full-stack ledger app: accounts, balances, and money transfers, backed by a real
double-entry ledger instead of a single "balance" number on each account.

**🔗 Live:** [Frontend](https://ledgerly-psi-five.vercel.app) || [Backend API](https://ledgerly-ohkb.onrender.com)


```
Ledgerly/
├── Frontend/   React + TanStack Start dashboard
└── Backend/    Express + MongoDB API
```

## ✨ Features

- 🔐 **Email/password auth** — JWT stored in an httpOnly cookie (with a bearer-token fallback),
  token blacklisting on logout so a logged-out token can't be reused.
- 🏦 **Accounts** — create multiple accounts, each with a live balance computed from the ledger
  (not stored as a mutable field).
- 📒 **Double-entry ledger** — every transfer writes an immutable DEBIT and CREDIT entry inside a
  MongoDB transaction. An account's balance is always `sum(CREDIT) - sum(DEBIT)`, derived on
  read, so it can't drift out of sync with its history.
- 🔁 **Idempotent transfers** — every transfer carries a client-generated idempotency key; retrying
  the same request never double-charges.
- 🧾 **Transaction history** — persisted server-side and fetched fresh on every visit, not held in
  local component state.
- 🎁 **Demo signup bonus** — every new account is credited ₹100 from an internal "treasury" account
  automatically, so there's something to transfer without needing a real payment integration.
  See the note on the Accounts page for details.
- 📧 **Transactional email** — welcome, transfer-success, and transfer-failure emails, sent via
  [Resend](https://resend.com) with styled HTML templates (see below).

## 🛠️ Tech stack

**Frontend** (`Frontend/`)
- [TanStack Start](https://tanstack.com/start) — file-based routing, SSR
- ⚛️ React 19 + TypeScript
- 🎨 Tailwind CSS + shadcn/ui
- 🔄 TanStack Query for data fetching/caching
- Axios

**Backend** (`Backend/`)
- 🟢 Node.js + Express 5
- 🍃 MongoDB + Mongoose (multi-document transactions for transfers)
- 🔑 JWT (`jsonwebtoken`) + `cookie-parser`
- 🔒 `bcryptjs` for password hashing
- 📬 [Resend](https://resend.com) for transactional email
- 🌐 `cors`

## 📧 Email notifications

All emails are sent through Resend from `src/services/email.service.js`, using shared HTML
templates in `src/services/email.templates.js`. Sending is fire-and-forget — a failed or slow
email never blocks or breaks the API response it's attached to.

| Email | Sent when | Function |
|---|---|---|
| 👋 Welcome | A user registers | `sendRegistrationEmail(userEmail, name)` |
| ✅ Transfer successful | A transfer completes | `sendTransactionEmail(userEmail, name, amount, toAccount)` |
| ❌ Transfer failed | A transfer fails | `sendTransactionFailureEmail(userEmail, name, amount, toAccount)` |

> **Note:** `sendTransactionFailureEmail` is defined and ready to use, but isn't currently called
> from the failed-transfer path in `transaction.controller.js` — wire it into the `catch` block
> there if you want failure emails to actually go out.

Requires a [Resend](https://resend.com) account and API key. Resend's sandbox `onboarding@resend.dev`
sender (used by default here) only delivers to the email address on your Resend account until you
verify your own domain — swap the `from` address in `email.service.js` once you do.

## 🚀 Getting started

You'll need Node.js 18+ and a MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas)).

### 1. Backend

```sh
cd Backend
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

`.env` values:

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (defaults to `5500`) |
| `FRONTEND_URL` | Your frontend's origin, for CORS (e.g. `http://localhost:8080`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `SIGNUP_BONUS_AMOUNT` | Demo credit given to new accounts (defaults to `100`, set to `0` to disable) |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com), used to send all transactional email (optional — registration/transfer still succeed if email fails to send) |

The API comes up at `http://localhost:5500`.

### 2. Frontend

```sh
cd Frontend
npm install
echo "VITE_API_URL=http://localhost:5500" > .env
npm run dev
```

The dev server runs at `http://localhost:8080`.

### Other frontend scripts

```sh
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint       # eslint
npm run format      # prettier --write
```

## 📡 API reference

All routes are prefixed with `/api`. Protected routes expect either the `token` cookie set on
login, or an `Authorization: Bearer <token>` header.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a user |
| POST | `/auth/login` | — | Log in, sets the auth cookie |
| POST | `/auth/logout` | — | Blacklist the current token |
| POST | `/accounts` | ✓ | Create an account for the logged-in user (credits the signup bonus) |
| GET | `/accounts` | ✓ | List the logged-in user's accounts |
| GET | `/accounts/balance/:accountId` | ✓ | Get a specific account's live balance |
| POST | `/transactions` | ✓ | Transfer between two of your own accounts |
| GET | `/transactions` | ✓ | List transactions (sent or received) across your accounts |
| POST | `/transactions/system/initial-funds` | ✓ (system user only, see [Becoming a system user](#-becoming-a-system-user)) | Credit any account from a system account |

### 📮 Postman collection

A ready-to-import collection covering every endpoint above lives at
[`Backend/docs/Ledgerly.postman_collection.json`](./Backend/docs/Ledgerly.postman_collection.json).

To use it:
1. Postman → **Import** → select the file.
2. Set the collection's `baseUrl` variable if your backend isn't on `http://localhost:5500/api`.
3. Run **Auth → Login**, then copy the returned `token` into the collection's `token` variable —
   the rest of the requests are pre-wired to send it as a bearer token.

## 🧑‍💼 Becoming a system user

The `POST /transactions/system/initial-funds` endpoint (see above) is intentionally locked down —
only a user with `systemUser: true` can call it. This mirrors how real ledgers separate "moving
money between accounts" from "creating money in the first place": regular users can only do the
former.

There's no public API route to promote a user to system-user status, and the field is `immutable`
at the Mongoose level, so it can only be set with a direct database write:

1. Register a normal user via `POST /auth/register` (e.g. `treasury@yourapp.com`).
2. Log in as that user and create an account for it via `POST /accounts` — the initial-funds
   endpoint debits from this account, so it needs one before it'll work.
3. Open the `users` collection in **MongoDB Compass** (or `mongosh`), find that user's document,
   and manually change its `systemUser` field from `false` to `true`.
4. Log in again to get a fresh token, then call `POST /transactions/system/initial-funds` with
   that token to credit any account.

This is a manual, one-time setup step per environment — most testing won't need it at all, since
new accounts are already funded automatically via `SIGNUP_BONUS_AMOUNT`.

## 🎁 Why new accounts start with ₹100

Every new account is credited `SIGNUP_BONUS_AMOUNT` (₹100 by default) automatically from an
internal treasury account, so there's a balance to test transfers with immediately after signup.

There's no self-serve deposit endpoint (card/bank funding) by design — only a trusted system
account can inject funds into the ledger. This mirrors real banking systems, where regular users
can move money *between* accounts but can't create money themselves. Exposing a public "add
funds" endpoint would break that separation.

The same note is shown on the Accounts page in the UI. If you're running this locally and want to
top up balances beyond the signup bonus, see [Becoming a system user](#-becoming-a-system-user)
below.

## 📁 Project structure

**Frontend**
- `src/routes/` — file-based routes (see `src/routes/README.md` for conventions)
- `src/pages/`, `src/components/` — page-level and shared UI components
- `src/api/` — API client calls
- `src/hooks/` — data-fetching hooks (accounts, balances, transactions)
- `src/context/AuthContext.jsx` — auth state

**Backend**
- `src/routes/` — Express route definitions
- `src/controllers/` — request handlers / business logic
- `src/models/` — Mongoose schemas (`user`, `account`, `transaction`, `ledger`, `tokenBlackList`)
- `src/middleware/` — auth guards
- `src/services/` — email (Resend + templates) and internal treasury-account logic

## ⚠️ Known limitations

- Amounts are stored as JS numbers, not integer cents — fine for a demo, but a production ledger
  should avoid floating-point arithmetic for money.
- No rate limiting on `/auth/login` or `/auth/register` yet.
- Transaction history is capped at the 50 most recent entries; no pagination yet.
- `sendTransactionFailureEmail` exists but isn't wired into the failed-transfer path yet.
- No automated test suite yet.
