# Team tasks

Each developer builds **full-stack features**: the API endpoint _and_ the page that uses it. That way everyone learns both NestJS and Next.js.

**How to use this file:** the lead creates one GitHub Issue per task (copy the task text into it) and assigns it. Do the tasks in order. A task is **done** when its PR is merged.

Reference code to copy:

- Backend: `apps/api/src/categories/`
- Frontend: `apps/web/src/app/categories/`

---

## Task 0: Setup and first PR (everyone, day 1)

**Goal:** get the project running and practice the Git workflow.

1. Follow the "Getting started" section of the README.
2. Open http://localhost:3001/api/docs, log in as the admin in Swagger, then create a category.
3. Open http://localhost:3000/categories and check that the new category shows up.
4. Read `docs/ARCHITECTURE.md`, then read every file in `apps/api/src/categories/` and `apps/web/src/app/categories/`.
5. Create the branch `docs/add-<your-name>`, add your name to the Team table in the README and open a PR.

**You'll learn:** monorepo layout, Docker, Prisma migrations, Swagger, the Git and PR flow.

---

# Sprint 1

## A1: Products API (Dev A)

**Goal:** CRUD endpoints for products.

| Method | Route                 | Who    | Notes                                                                |
| ------ | --------------------- | ------ | -------------------------------------------------------------------- |
| GET    | `/api/products`       | public | paginated; filters `?category=<slug>&search=<text>`; only `isActive` |
| GET    | `/api/products/:slug` | public | include the category; 404 if not found                               |
| POST   | `/api/products`       | ADMIN  | `CreateProductDto`                                                   |
| PATCH  | `/api/products/:id`   | ADMIN  | `UpdateProductDto`                                                   |
| DELETE | `/api/products/:id`   | ADMIN  | soft delete: set `isActive = false`                                  |

**Files:** `apps/api/src/products/*`, then register `ProductsModule` in `app.module.ts`.

**Acceptance criteria**

- [ ] `ProductQueryDto extends PaginationQueryDto` with optional `category` and `search`
- [ ] Search is case-insensitive on the name (`contains`, `mode: 'insensitive'`)
- [ ] `priceCents` and `stock` are validated as integers ≥ 0
- [ ] A customer token gets `403` on POST/PATCH/DELETE
- [ ] Unit tests for `findAll` (with filters) and `findBySlug` (found / not found)
- [ ] All endpoints visible and documented in Swagger

**You'll learn:** modules, DTO validation, Prisma `where` filters and relations, guards.

## B1: Login and register pages (Dev B)

**Goal:** users can register, log in and log out.

**Files:** `apps/web/src/app/login/page.tsx`, `apps/web/src/app/register/page.tsx`, `apps/web/src/lib/auth.ts`, `apps/web/src/components/layout/header.tsx`

**Steps**

1. In `lib/auth.ts`, write Server Actions (`'use server'`) `login`, `register` and `logout`. They call the API with `api()`, then save `accessToken` in an **httpOnly cookie** with `cookies().set('token', ..., { httpOnly: true, sameSite: 'lax', path: '/' })`.
2. Add a `getCurrentUser()` helper that reads the cookie and returns the user. For now, decode it from the login response you stored. After task B2, call `GET /api/users/me`.
3. Build the forms with `components/ui/Input` and `Button`. Use `useActionState` to show API errors (for example "Invalid email or password").
4. In the header, show "Hi, <name>" and a Logout button when logged in. Otherwise show Login.

**Acceptance criteria**

- [ ] Register → logged in → redirected to `/`
- [ ] Wrong password shows an error message and does not crash
- [ ] Logout clears the cookie
- [ ] The token is not readable from browser JavaScript (`document.cookie` doesn't show it)

**You'll learn:** client vs server components, Server Actions, forms, cookies, JWT.

## A2: Products pages (Dev A, after A1)

**Goal:** customers can browse products.

**Files:** `apps/web/src/app/products/page.tsx`, `apps/web/src/app/products/[slug]/page.tsx`, `apps/web/src/components/product-card.tsx`, `Product` type in `lib/types.ts`

**Acceptance criteria**

- [ ] `/products` shows a responsive grid (image, name, price with `formatPrice`)
- [ ] Filter by category with `?category=books` (the category links on `/categories` lead here)
- [ ] A search box that updates `?search=`
- [ ] Pagination (Previous / Next)
- [ ] `/products/[slug]` shows the details. An unknown slug shows the 404 page (`notFound()`)
- [ ] `loading.tsx` and `error.tsx` exist, as in `app/categories/`

**You'll learn:** dynamic routes, `searchParams`, `next/image`, reusable components.

## B2: Profile, `/users/me` (Dev B, after B1)

**Goal:** a logged-in user can see and edit their profile.

**API:** in `apps/api/src/users/`, add a `UsersController` with:

- `GET /api/users/me` → the current user (use `@CurrentUser()` and `UsersService.toPublic`)
- `PATCH /api/users/me` → update `name` (`UpdateProfileDto`)

**Web:** `apps/web/src/app/account/page.tsx` shows the profile with an edit form. If the user is not logged in, redirect to `/login`.

**Acceptance criteria**

- [ ] `passwordHash` is never returned
- [ ] `401` without a token
- [ ] Unit test for `updateProfile`
- [ ] Header "Hi, <name>" updates after the name changes

**You'll learn:** `@CurrentUser`, protecting pages, PATCH flows.

---

# Sprint 2

## A3: Cart API (Dev A)

| Method | Route                        | Notes                                                                |
| ------ | ---------------------------- | -------------------------------------------------------------------- |
| GET    | `/api/cart`                  | current user's cart with items + products + `totalCents`             |
| POST   | `/api/cart/items`            | `{ productId, quantity }`; adds to an existing line if already there |
| PATCH  | `/api/cart/items/:productId` | `{ quantity }`; `0` removes the line                                 |
| DELETE | `/api/cart/items/:productId` | remove line                                                          |

**Acceptance criteria**

- [ ] The cart is created automatically on first use (`upsert`)
- [ ] Quantity can't exceed `product.stock` (`400` with a clear message)
- [ ] Inactive products can't be added
- [ ] Unit tests for add (new line / existing line / over stock)

**You'll learn:** relations, `upsert`, composite unique keys (`cartId_productId`), business rules.

## B3: Admin products UI (Dev B, uses Dev A's API)

**Goal:** admins manage products from the website.

**Files:** `apps/web/src/app/admin/products/page.tsx` (table), `.../new/page.tsx`, `.../[id]/edit/page.tsx`

**Acceptance criteria**

- [ ] Only admins can open `/admin/*` (others are redirected)
- [ ] Table with edit and deactivate buttons
- [ ] Create/edit form with validation errors from the API shown next to the fields
- [ ] Price entered in dollars in the form and sent in cents

**You'll learn:** reading someone else's API (Swagger), forms with many fields, role-based UI.

## A4: Cart page (Dev A, uses Dev B's auth)

**Acceptance criteria**

- [ ] "Add to cart" button on the product detail page (redirects to login if needed)
- [ ] `/cart` lists items with + / − buttons, remove and the total
- [ ] Cart item count badge in the header
- [ ] Empty-cart state with a link to `/products`

**You'll learn:** client components with state, optimistic UI, `revalidatePath`.

## B4: Addresses (Dev B)

**API:** `GET/POST/PATCH/DELETE /api/addresses` (only your own addresses; setting `isDefault` unsets the others).
**Web:** manage addresses on `/account`.

**Acceptance criteria**

- [ ] A user can never read or change another user's address (`404`)
- [ ] Only one default address per user
- [ ] Unit tests for the ownership check and the default switching

**You'll learn:** authorization by ownership, transactions.

---

# Sprint 3

## A5: Orders API and checkout (Dev A)

- `POST /api/orders` `{ addressId }`: creates an order from the cart **in one `prisma.$transaction`**:
  1. Check stock for every item (fail the whole thing if one is out of stock)
  2. Create `Order` + `OrderItem`s (copy name and price, and copy the address into `shippingAddress`)
  3. Decrement product stock
  4. Empty the cart
- `GET /api/orders` (mine, newest first) and `GET /api/orders/:id` (mine only)

**Acceptance criteria**

- [ ] Ordering with an empty cart → `400`
- [ ] Stock never goes negative
- [ ] Unit tests for the checkout rules

**You'll learn:** database transactions, data snapshots, the most important flow of any shop.

## B5: Checkout and order history pages (Dev B)

- `/checkout`: pick an address, review the items and total, "Place order"
- `/orders`: list of my orders. `/orders/[id]`: details and status

**You'll learn:** multi-step flows, connecting to a teammate's API.

---

# Sprint 4 (pick what you like)

| Task | Owner | Description                                                                                  |
| ---- | ----- | -------------------------------------------------------------------------------------------- |
| A6   | Dev A | Product image upload (Nest `FileInterceptor`, store in `/uploads` or S3)                     |
| A7   | Dev A | Product reviews and ratings (needs a schema change, so talk to the lead)                     |
| B6   | Dev B | Admin orders page: list all orders and change status (`PATCH /api/orders/:id/status`, ADMIN) |
| B7   | Dev B | Home page: featured products and a hero banner                                               |
| L1   | Lead  | Stripe checkout in test mode (webhook sets the order to `PAID`)                              |
| L2   | Lead  | Deploy: web on Vercel, API + Postgres on Railway/Render                                      |

---

## Lead checklist (ongoing)

- [ ] Create issues from this file and assign them
- [ ] Review every PR within 24h: run it locally and leave at least one learning comment
- [ ] Own `schema.prisma`: approve schema changes and watch for migration conflicts
- [ ] Weekly 30-min demo: each dev shows what they built and explains one thing they learned
