# Blume

Blume is a lightweight business management demo for freelancers and small teams. It combines a React dashboard with a REST API, Prisma and PostgreSQL so users can manage clients, services, quotes and follow-up tasks from isolated workspaces.

## Current Scope

- Public landing page with login, register and demo access.
- Authenticated dashboard with real metrics from the database.
- Client management with create, edit, delete and detail views.
- Catalog management for services and prices.
- Quote management with statuses, tax totals and downloadable summaries.
- Task management linked to clients and quotes.
- Demo mode with seeded data for portfolio review.
- Workspace-based data isolation for each registered account.

## Architecture

```txt
Blume/
├── blume-web/   React + Vite + TypeScript frontend
└── blume-api/   Express + Prisma REST API
```

Production data flow:

```txt
React app -> REST API -> Prisma -> Neon PostgreSQL
```

The frontend never connects directly to Neon. All database access goes through the API.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Axios, lucide-react.
- Backend: Node.js, Express, TypeScript, Prisma, Zod.
- Database: PostgreSQL on Neon.
- Deployment: Vercel for `blume-web`, Render or similar Node hosting for `blume-api`.

## Environment Variables

### `blume-web`

Create `blume-web/.env` locally:

```env
VITE_API_URL=http://localhost:4000/api
```

In Vercel production:

```env
VITE_API_URL=https://your-api-host.com/api
```

### `blume-api`

Create `blume-api/.env` locally:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
WEB_ORIGIN=http://localhost:5173
PORT=4000
```

In production:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
WEB_ORIGIN=https://your-vercel-app.vercel.app
PORT=4000
```

`WEB_ORIGIN` accepts comma-separated origins if needed.

## Local Development

Install dependencies:

```bash
cd blume-api
npm install

cd ../blume-web
npm install
```

Prepare the database:

```bash
cd blume-api
npx prisma migrate deploy
npm run prisma:generate
npm run prisma:seed
```

Run the API:

```bash
cd blume-api
npm run dev
```

Run the frontend:

```bash
cd blume-web
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- API health check: `http://localhost:4000/api/health`

## Useful Scripts

### API

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Web

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deployment Notes

For Vercel:

- Root directory: `blume-web`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api-host.com/api`

For the API host:

- Root directory: `blume-api`
- Build command: `npm install && npm run build && npx prisma migrate deploy`
- Start command: `npm run start`
- Environment variables: `DATABASE_URL`, `WEB_ORIGIN`, `PORT`

Node runtime is constrained to:

```json
">=22 <25"
```

## Roadmap

- Add automated cleanup for demo workspaces older than 7 days.
- Add explicit active workspace selection with `X-Workspace-Id`.
- Recalculate quote totals from editable quote lines when quote editing becomes richer.
- Add backend tests for auth, client CRUD, workspace isolation and quote creation.
- Add PDF generation for quotes with company branding.
- Add company settings: logo, tax ID, address, default tax rate and currency.

## Demo Account

After running the seed:

```txt
Email: demo@blume.local
Password: password123
```
