# 🚀 TanStack Start Monorepo

A full-stack monorepo built with **TanStack Start** (SSR/web), **Hono** (API server), **tRPC**, **Better Auth**, **Drizzle ORM**, and **PostgreSQL** — all orchestrated with **Turborepo** and **pnpm workspaces**.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend / SSR** | [TanStack Start](https://tanstack.com/start) + React 19 |
| **API Server** | [Hono](https://hono.dev) + tRPC |
| **Auth** | [Better Auth](https://www.better-auth.com) |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team) |
| **Database** | PostgreSQL 16 |
| **Styling** | Tailwind CSS v4 |
| **Monorepo** | [Turborepo](https://turbo.build) + pnpm workspaces |
| **Reverse Proxy** | Nginx (Docker only) |
| **Runtime** | Node.js 22 |

---

## 🗂️ Project Structure

```
t3-repo-v4/
├── apps/
│   ├── tanstack-start/      # TanStack Start SSR web app (port 3000)
│   │   ├── src/
│   │   │   ├── routes/      # File-based routing
│   │   │   ├── lib/         # tRPC client, utils
│   │   │   ├── component/   # Shared UI components
│   │   │   ├── auth/        # Auth client setup
│   │   │   ├── env.ts       # Typed environment variables
│   │   │   └── router.tsx   # Router configuration
│   │   ├── Dockerfile       # Multi-stage Docker build
│   │   ├── vite.config.ts   # Vite + TanStack Start + Nitro config
│   │   └── turbo.json       # Package-level turbo config (persistent dev)
│   └── server/              # Hono API server (port 3001)
│       ├── src/
│       │   └── server.ts    # Hono app entry — tRPC + Better Auth routes
│       ├── Dockerfile       # Multi-stage Docker build
│       └── turbo.json       # Package-level turbo config (persistent dev)
│
├── packages/
│   ├── api/                 # tRPC router definitions (shared)
│   ├── auth/                # Better Auth config (shared)
│   ├── db/                  # Drizzle ORM schema, migrations, client
│   │   └── docker-compose.yml  # Local PostgreSQL container
│   ├── ui/                  # Shared UI component library
│   └── validators/          # Shared Zod schemas
│
├── tooling/
│   ├── eslint/              # Shared ESLint config
│   ├── prettier/            # Shared Prettier config
│   ├── tailwind/            # Shared Tailwind config
│   ├── typescript/          # Shared tsconfig bases
│   └── github/              # GitHub Actions workflows
│
├── docker-compose.yml       # Full-stack Docker Compose (web + api + nginx)
├── nginx.conf               # Nginx reverse proxy config
├── turbo.json               # Root Turborepo config
├── pnpm-workspace.yaml      # pnpm workspace + catalog
└── .env.example             # Environment variable template
```

---

## 🌐 Ports

| Service | Port | Description |
|---|---|---|
| **Web (TanStack Start)** | `3000` | SSR frontend app |
| **API (Hono)** | `3001` | tRPC + REST API |
| **PostgreSQL** | `5433` | Database (local Docker) |
| **Nginx** | `80` | Reverse proxy (Docker Compose only) |

### Nginx Routing (Docker Compose)

| Path | Target |
|---|---|
| `/api/*` | Hono API server (`localhost:3001`) |
| `/*` | TanStack Start web app (`localhost:3000`) |

---

## ⚡ Getting Started (Local Development)

### Prerequisites

- [Node.js 22+](https://nodejs.org)
- [pnpm 10+](https://pnpm.io) — `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL)

### 1. Clone the repo

```bash
git clone https://github.com/girishcx07/tanstack-start-monorepo.git
cd tanstack-start-monorepo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# PostgreSQL — matches the local Docker container below
DATABASE_URL="postgresql://postgres:password@localhost:5433/acme"

# Generate with: openssl rand -base64 32
AUTH_SECRET="your_secret_here"
```

### 4. Start the local PostgreSQL database

```bash
docker compose -f packages/db/docker-compose.yml up -d
```

This starts a PostgreSQL 16 container on **port 5433**.

### 5. Push database schema

```bash
pnpm db:push
```

### 6. Start the dev server

```bash
pnpm dev
```

This runs all packages in watch mode via Turborepo. The browser will open automatically at **http://localhost:3000**.

| What starts | Command internally |
|---|---|
| `@acme/tanstack-start` | `vite dev` (port 3000) |
| `@acme/server` | `tsx watch src/server.ts` (port 3001) |
| `@acme/api`, `@acme/db`, etc. | `tsc --watch` |

---

## 🔧 Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all packages in development mode |
| `pnpm build` | Build all packages for production |
| `pnpm lint` | Lint all packages with ESLint |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Check formatting with Prettier |
| `pnpm format:fix` | Auto-fix formatting |
| `pnpm db:push` | Push Drizzle schema to the database |
| `pnpm db:studio` | Open Drizzle Studio (database UI) |

---

## 🐳 Docker

The project ships with Docker support for both apps and a full-stack Docker Compose setup with Nginx as a reverse proxy.

### Start full stack with Docker Compose

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your production values

# Build and start all containers
docker compose up --build
```

This starts:
- **Nginx** on `http://localhost:80` (reverse proxy)
- **TanStack Start** web app on internal port `3000`
- **Hono API** server on internal port `3001`

> Access the app at **http://localhost** (port 80 via Nginx)

### Start database only

```bash
docker compose -f packages/db/docker-compose.yml up -d
```

### Stop all containers

```bash
docker compose down
```

### Individual app Dockerfiles

Both apps use **multi-stage Docker builds** powered by Turborepo's `prune` feature for minimal image sizes:

| App | Dockerfile | Exposed Port |
|---|---|---|
| TanStack Start | `apps/tanstack-start/Dockerfile` | `3000` |
| Hono API Server | `apps/server/Dockerfile` | `3001` |

Build individual images:

```bash
# Web app
docker build -f apps/tanstack-start/Dockerfile -t acme-web .

# API server
docker build -f apps/server/Dockerfile -t acme-api .
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5433/acme` |
| `AUTH_SECRET` | Secret key for Better Auth (min 32 chars) | `openssl rand -base64 32` |
| `AUTH_DISCORD_ID` | Discord OAuth client ID (optional) | — |
| `AUTH_DISCORD_SECRET` | Discord OAuth client secret (optional) | — |
| `AUTH_REDIRECT_PROXY_URL` | Auth redirect proxy URL (optional) | — |
| `PORT` | Server port override (optional) | `3001` |

---

## 📐 Architecture Overview

```
Browser
  │
  ▼
Nginx :80  (Docker only)
  ├─ /api/* ──────────► Hono Server :3001
  │                          │
  │                     tRPC Router
  │                          │
  └─ /*  ────────────► TanStack Start :3000
                            │
                       SSR + tRPC Client
                            │
                            ▼
                     PostgreSQL :5433
                    (via Drizzle ORM)
```

In **local development** (no Docker):
- **http://localhost:3000** → TanStack Start (Vite dev server)
- **http://localhost:3001** → Hono API (tsx watch)
- **http://localhost:5433** → PostgreSQL (Docker container)

---

## 📝 License

MIT
