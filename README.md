# E-Commerce

A full-stack e-commerce app built by our team to learn **NestJS** (backend) and **Next.js** (frontend).

| Part     | Tech                                                  | Folder      | URL                            |
| -------- | ----------------------------------------------------- | ----------- | ------------------------------ |
| API      | NestJS, Prisma, PostgreSQL, JWT, Swagger              | `apps/api/` | http://localhost:3001/api      |
| API docs | Swagger UI (try every endpoint in the browser)        |             | http://localhost:3001/api/docs |
| Web      | Next.js (App Router), React, Tailwind CSS             | `apps/web/` | http://localhost:3000          |
| DB admin | Adminer (server `postgres`, user/pass/db `ecommerce`) |             | http://localhost:8080          |

## Prerequisites

- [Node.js 22](https://nodejs.org/) (`node -v`)
- [pnpm 10](https://pnpm.io/installation): `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL). It must be **running**.
- VS Code: install the recommended extensions when prompted.

## Getting started

```bash
# 1. Clone and install
git clone <REPO_URL> e-commerce
cd e-commerce
pnpm install

# 2. Create your local env files (never commit them!)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Start PostgreSQL, create the tables and add demo data
pnpm db:up
pnpm db:migrate
pnpm db:seed

# 4. Run the API and the web app together
pnpm dev
```

Open http://localhost:3000/categories. If you see 3 categories, everything works.

### Demo accounts (local only, created by the seed)

| Email                 | Password       | Role     |
| --------------------- | -------------- | -------- |
| `admin@shop.local`    | `Password123!` | ADMIN    |
| `customer@shop.local` | `Password123!` | CUSTOMER |

To call a protected endpoint in Swagger, run `POST /api/auth/login`, copy the `accessToken`, click **Authorize** (top right) and paste it.

## Scripts (run from the repo root)

| Command                         | What it does                                               |
| ------------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                      | Run API + web in watch mode                                |
| `pnpm dev:api` / `pnpm dev:web` | Run only one of them                                       |
| `pnpm db:up` / `pnpm db:down`   | Start / stop PostgreSQL in Docker                          |
| `pnpm db:migrate`               | Apply migrations (creates a new one if the schema changed) |
| `pnpm db:seed`                  | Insert demo data                                           |
| `pnpm db:studio`                | Open Prisma Studio to browse the database                  |
| `pnpm lint`                     | Lint both apps                                             |
| `pnpm typecheck`                | TypeScript check both apps                                 |
| `pnpm test`                     | Run unit tests                                             |
| `pnpm build`                    | Production build of both apps                              |
| `pnpm format`                   | Format all files with Prettier                             |

## Where to start reading

1. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how a request flows from the browser to the database
2. [CONTRIBUTING.md](CONTRIBUTING.md): branches, commits, pull requests
3. [docs/TASKS.md](docs/TASKS.md): your tasks
4. The **reference code** to copy for every new feature:
   - Backend: `apps/api/src/categories/`
   - Frontend: `apps/web/src/app/categories/`

## Team

| Name        | Role      |
| ----------- | --------- |
| _your name_ | Team lead |
| _your name_ | Dev A     |
| _your name_ | Dev B     |

## Troubleshooting

- **`Can't reach database server`**: Docker Desktop is not running, or you forgot `pnpm db:up`.
- **`Cannot find module '../generated/prisma/client.js'`**: run `pnpm --filter api prisma:generate`.
- **Port already in use**: something else uses 3000/3001/5433. Stop it or change `PORT` in `apps/api/.env`.
- **The web app shows "Could not load categories"**: the API is not running. Check the `pnpm dev` output.
