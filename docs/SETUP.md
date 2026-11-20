# Setup guide

Everything you need to install, run the project, and look inside the database.

---

## 1. What to install (one time)

| Tool                                                              | Why                              | Check it works      |
| ----------------------------------------------------------------- | -------------------------------- | ------------------- |
| [Node.js 22 (LTS)](https://nodejs.org/)                           | Runs the API and the website     | `node -v` → `v22.x` |
| **pnpm**: run `npm install -g pnpm` after installing Node         | Installs packages, runs commands | `pnpm -v` → `10.x`  |
| [Git](https://git-scm.com/downloads)                              | Version control                  | `git --version`     |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Runs the PostgreSQL database     | `docker --version`  |
| [VS Code](https://code.visualstudio.com/)                         | Code editor (recommended)        |                     |

Notes:

- **Windows:** Docker Desktop asks to enable **WSL 2**. Say yes and restart the computer if it asks.
- **Docker Desktop must be open and running** (whale icon in the taskbar) every time you work on the project.
- When you open the project in VS Code, click **Install** on the "recommended extensions" popup (ESLint, Prettier, Prisma, Tailwind).

---

## 2. First-time setup

Open a terminal (VS Code: `` Ctrl+` ``) and run, one by one:

```bash
# Get the code
git clone <REPO_URL> e-commerce
cd e-commerce

# Install all packages (API + website)
pnpm install

# Create your local settings files from the templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Start the database (Docker Desktop must be running)
pnpm db:up

# Create the tables
pnpm db:migrate

# Fill the tables with demo data
pnpm db:seed
```

> Never commit `.env` or `.env.local`. Git already ignores them.

---

## 3. Run the project (every day)

```bash
pnpm db:up    # start the database (if it isn't already running)
pnpm dev      # start the API and the website together
```

Then open:

| What                                   | URL                            |
| -------------------------------------- | ------------------------------ |
| Website                                | http://localhost:3000          |
| API                                    | http://localhost:3001/api      |
| API docs (Swagger, try every endpoint) | http://localhost:3001/api/docs |

**It works if** http://localhost:3000/categories shows 3 categories.

Stop everything: press `Ctrl+C` in the terminal, then run `pnpm db:down` to stop the database (your data is kept).

### Demo accounts (local only)

| Email                 | Password       | Role     |
| --------------------- | -------------- | -------- |
| `admin@shop.local`    | `Password123!` | ADMIN    |
| `customer@shop.local` | `Password123!` | CUSTOMER |

**Calling a protected endpoint in Swagger:**

1. Open `POST /auth/login` → **Try it out** → **Execute**.
2. Copy the `accessToken` from the response.
3. Click **Authorize** 🔒 (top right) and paste the token.

---

## 4. See the data in the database

Use any of these options. They all show the same database.

### Option A: Prisma Studio (easiest, recommended)

```bash
pnpm db:studio
```

It opens **http://localhost:5555** in your browser. Click a table (User, Category, Product, …) to see its rows. You can also add, edit and delete rows there.

### Option B: Adminer (web database admin, runs in Docker)

`pnpm db:up` starts it together with the database. Open **http://localhost:8080** and log in with:

| Field    | Value        |
| -------- | ------------ |
| System   | `PostgreSQL` |
| Server   | `postgres`   |
| Username | `ecommerce`  |
| Password | `ecommerce`  |
| Database | `ecommerce`  |

Then click a table → **Select data**. Use **SQL command** to write your own queries, for example:

```sql
SELECT name, "priceCents", stock FROM "Product" ORDER BY name;
```

> Table and column names with capital letters need "double quotes" in PostgreSQL.

### Option C: A desktop app (pgAdmin, DBeaver, TablePlus, VS Code extension)

Create a new PostgreSQL connection with:

| Field    | Value       |
| -------- | ----------- |
| Host     | `localhost` |
| Port     | **`5433`**  |
| Username | `ecommerce` |
| Password | `ecommerce` |
| Database | `ecommerce` |

> The port is **5433**, not the usual 5432, so it doesn't clash with a PostgreSQL you may have installed on your computer.

### Option D: Command line (psql inside Docker)

```bash
docker exec -it ecommerce-postgres psql -U ecommerce
```

Useful commands: `\dt` (list tables), `\d "Product"` (describe a table), `SELECT * FROM "Category";`, `\q` (quit).

---

## 5. Watching data being created and deleted

A good way to understand the whole flow:

1. Open **Prisma Studio** (`pnpm db:studio`) on the `Category` table.
2. In **Swagger**, log in as the admin and call `POST /categories` with:
   ```json
   { "name": "Toys", "slug": "toys" }
   ```
3. In Prisma Studio, click **Refresh**: the new row is there. It also appears on http://localhost:3000/categories.
4. In Swagger, call `DELETE /categories/{id}` with that row's `id`.
5. Refresh Prisma Studio: the row is gone.

**About deleted data:**

- A real `DELETE` removes the row for good. There is no "trash" in the database.
- Some features use a **soft delete** instead. Products (Task A1), for example, only set `isActive = false`, so the row stays in the table but is hidden on the website. Look at the `isActive` column to see "deleted" products.
- Orders keep a copy of product names and prices (`OrderItem`), so old orders stay correct even if a product changes later.

---

## 6. Reset the database (start fresh)

Messed up the data? This deletes **everything** in your local database, then re-creates the tables and demo data:

```bash
pnpm --filter api exec prisma migrate reset
```

This only affects **your** computer. Each teammate has their own local database.

---

## 7. Common problems

| Problem                                              | Fix                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `Can't reach database server`                        | Open Docker Desktop, then run `pnpm db:up`                             |
| `error during connect ... dockerDesktopLinuxEngine`  | Docker Desktop isn't running: open it and wait until it says "running" |
| `Cannot find module '../generated/prisma/client.js'` | `pnpm --filter api prisma:generate`                                    |
| Website shows "Could not load categories"            | The API isn't running. Check the `pnpm dev` output for errors          |
| `Port 3000 / 3001 / 5433 is already in use`          | Close the other program using it, or restart the computer              |
| `Authentication failed against database server`      | Check that `DATABASE_URL` in `apps/api/.env` uses port **5433**        |
| A teammate added a migration and your app now errors | `git pull`, then `pnpm install`, then `pnpm db:migrate`                |
| Docker image download is very slow / times out       | Retry `pnpm db:up`, since the first download can take a while          |
