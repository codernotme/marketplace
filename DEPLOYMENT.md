# Themrktplace POS Platform Deployment Guide

This guide covers everything required to start the full `themrktplace` monorepo platform locally for development or production.

## Prerequisites
- Node.js v20+
- npm v10+ (using workspaces)
- Docker & Docker Compose
- Redis (via Docker)
- PostgreSQL (via Docker)
- Typesense (via Docker)

## 1. Environment Setup
A sample environment file is provided at the root of the project. Copy it to `.env` to get started.

```bash
cp .env.example .env
```

Ensure you configure all the necessary external services:
- **Resend**: Used for transactional emails (auth, low stock alerts). You need a valid API key.
- **Typesense**: Search engine. Leave the default local configuration for development.

## 2. Starting Infrastructure Services
The platform relies on Postgres, Redis, and Typesense. Start them using Docker Compose:

```bash
docker-compose up -d postgres redis typesense
```

Verify that the services are running:
```bash
docker ps
```

## 3. Database Initialization
Once Postgres is running, you need to push the Prisma schema and run seed scripts (if available):

```bash
npm install
npx turbo run db:push --filter=@themrktplace/schema
# or
npx prisma migrate dev --schema=packages/schema/src/prisma/schema.prisma
```

## 4. Starting the Application
The monorepo contains multiple workspaces that need to run concurrently:
1. `apps/api` - The Fastify Backend (Port 3001)
2. `apps/dashboard` - The Next.js Frontend (Port 3000)
3. `apps/storefront` - The Storefront Frontend (Port 3002)
4. `apps/internal-admin` - The Internal Admin Panel (Port 3003)

Start both in development mode from the root directory:

```bash
npm run dev
```

This command uses Turbo to spin up both the API and the Dashboard concurrently.

### Worker Processes
The background workers (powered by BullMQ) automatically start with the API process. They handle tasks like:
- Processing incoming webhook events
- Dispatching Low Stock alerts
- Executing heavy inventory calculations

## 5. Docker Deployment (Full Stack)
To run the entire stack (including the API) via Docker, use the provided compose files. Note that the dashboard usually requires a separate build step for production.

```bash
# Build and run the entire infrastructure + API
docker-compose up --build -d
```

### Note on Dashboard Deployment:
The Next.js dashboard is optimized for Vercel deployment. Connect the `apps/dashboard` folder to your Vercel project and set the corresponding environment variables.

## Troubleshooting
- **Type Errors**: If you encounter type errors, run `npm run typecheck` at the root. The Prisma schema is the source of truth, ensure it is generated via `npx turbo run build --filter=@themrktplace/schema`.
- **Worker Imports**: The BullMQ library relies on ESM. Ensure your Node environment fully supports ESM module resolution.
- **Search Not Syncing**: If Typesense isn't syncing, check the API console for connection refused errors, and ensure `TYPESENSE_HOST` is correctly mapped.
