# Basic Auth Application With Express.js React.js

A full-stack monorepo built with **Turborepo**, featuring a **React** (Vite) frontend and an **Express** backend with **PostgreSQL**.

## Live Demo

| App         | URL                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Frontend    | [basic-auth-expressjs-reactjs-web.vercel.app](https://basic-auth-expressjs-reactjs-web.vercel.app/)                                 |
| API Swagger | [basic-auth-expressjs-reactjs-production.up.railway.app/docs](https://basic-auth-expressjs-reactjs-production.up.railway.app/docs/) |

## Tech Stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | React 19, Vite, Redux Toolkit, TanStack Query    |
| Backend  | Express 4, Sequelize, PostgreSQL                 |
| UI       | shadcn/ui (shared package), Tailwind CSS         |
| Tooling  | Turborepo, pnpm workspaces, TypeScript, Prettier |
| Infra    | Docker Compose (Postgres + Adminer)               |

## Prerequisites

- [Node.js](https://nodejs.org/) **>= 20**
- [pnpm](https://pnpm.io/) **9.15.9** (`corepack enable` to activate)
- [Docker](https://www.docker.com/) & Docker Compose (for the database)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bdhoag/basic-auth-expressjs-reactjs.git
cd basic-auth-expressjs-reactjs
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example env file at the project root:

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```env
# Database
DB_NAME=mydb
DB_USER=postgres
DB_PASS=123456
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=secret123
JWT_EXPIRES_IN=1m
JWT_REFRESH_SECRET=refresh_secret_456
JWT_REFRESH_EXPIRES_IN=15m

# API
APP_PORT=3000
```

For the frontend, create `apps/web/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Start the database

```bash
docker compose up -d
```

This spins up:

| Service    | Port   | Description            |
| ---------- | ------ | ---------------------- |
| `postgres` | `5432` | PostgreSQL 15 database |
| `adminer`  | `9090` | Database admin UI      |

> The database tables are auto-created on API startup via `sequelize.sync()`.

### 5. Run the app (development)

```bash
pnpm dev    # starts both web & api via Turborepo
```

The app will be available at:

| App      | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:5173      |
| API      | http://localhost:3000      |
| Swagger  | http://localhost:3000/docs |
| Adminer  | http://localhost:9090      |

## Scripts

Run from the project root:

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Start all apps in development mode |
| `pnpm build`     | Build all apps and packages        |
| `pnpm lint`      | Lint all apps and packages         |
| `pnpm format`    | Format code with Prettier          |
| `pnpm typecheck` | Run TypeScript type checking       |

## Project Structure

```
basic-auth-expressjs-reactjs/
├── apps/
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── config/      # DB & Swagger config
│   │   │   ├── controllers/ # Route handlers
│   │   │   ├── middleware/   # Auth middleware
│   │   │   ├── models/      # Sequelize models
│   │   │   ├── routes/      # API routes
│   │   │   ├── services/    # Business logic
│   │   │   ├── app.ts       # Express app setup
│   │   │   └── server.ts    # Entry point
│   │   └── package.json
│   └── web/                 # React SPA (Vite)
│       ├── src/
│       │   ├── app/         # Providers, store, initializer
│       │   ├── components/  # Shared components
│       │   ├── features/    # Feature modules (auth, etc.)
│       │   ├── layouts/     # Page layouts
│       │   ├── pages/       # Route pages
│       │   ├── routes/      # Router config
│       │   ├── services/    # API service layer
│       │   └── App.tsx      # Root component
│       └── package.json
├── packages/
│   └── ui/                  # Shared shadcn/ui components
├── docker-compose.yaml
├── Dockerfile
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```
