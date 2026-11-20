# Architecture

## The big picture

```
 Browser
   │
   ▼
 Next.js  (apps/web, :3000)
   │   pages in src/app/, all HTTP calls go through src/lib/api.ts
   │   HTTP + JSON   (Authorization: Bearer <JWT> for protected routes)
   ▼
 NestJS   (apps/api, :3001/api)
   │   Controller → Service → PrismaService
   ▼
 PostgreSQL (Docker, :5432)
```

## Backend (NestJS): how one request flows

Example: `POST /api/categories` with a JSON body.

1. **`main.ts`**: the global `ValidationPipe` checks the body against `CreateCategoryDto`. Invalid data gets a `400` with the list of errors.
2. **`JwtAuthGuard`** (global): checks the `Authorization: Bearer <token>` header. If it's missing or invalid → `401`. Routes marked `@Public()` skip this.
3. **`RolesGuard`** (global): if the route has `@Roles('ADMIN')` and the user isn't an admin → `403`.
4. **Controller** (`categories.controller.ts`): reads the params/body and calls the service. No business logic here.
5. **Service** (`categories.service.ts`): business logic plus database access through `PrismaService`.
6. **`PrismaExceptionFilter`**: if Prisma throws (duplicate value → `409`, record not found → `404`), the client gets a clean error.

### Folder conventions (one folder per feature)

```
src/products/
├─ dto/
│  ├─ create-product.dto.ts     # validated request body (class-validator + @ApiProperty)
│  ├─ update-product.dto.ts     # PartialType(CreateProductDto)
│  └─ product-query.dto.ts      # extends PaginationQueryDto with filters
├─ entities/product.entity.ts   # response shape for Swagger
├─ products.controller.ts
├─ products.service.ts
├─ products.service.spec.ts     # unit test with a mocked PrismaService
└─ products.module.ts           # then import it in app.module.ts
```

Tip: `pnpm --filter api exec nest g resource products --no-spec` generates this skeleton. Afterwards, change imports to end in `.js` (the project uses ESM).

### Useful building blocks

| What                                       | Where                                           |
| ------------------------------------------ | ----------------------------------------------- |
| `@Public()`: no login needed               | `src/auth/decorators/public.decorator.ts`       |
| `@Roles('ADMIN')`: admin only              | `src/auth/decorators/roles.decorator.ts`        |
| `@CurrentUser()`: the logged-in user       | `src/auth/decorators/current-user.decorator.ts` |
| `PaginationQueryDto` + `paginate()`        | `src/common/dto/pagination-query.dto.ts`        |
| `UsersService.toPublic()`: strip passwords | `src/users/users.service.ts`                    |

### Important rules

- **Money is stored in cents** (`priceCents: Int`). Never use floats for money.
- **Never return `passwordHash`.** Use `UsersService.toPublic(user)`.
- **Orders copy product name and price** (`OrderItem.productName`, `unitPriceCents`), because product prices can change later.
- When an operation changes several tables (e.g. checkout), use `prisma.$transaction(...)`.

## Frontend (Next.js)

- **App Router**: every folder in `src/app/` with a `page.tsx` is a route. `src/app/products/[slug]/page.tsx` → `/products/headphones`.
- **Server components by default.** They can `await api(...)` directly. Add `'use client'` at the top only when you need state, effects or event handlers (forms, buttons, cart).
- **`src/lib/api.ts`** is the only file that calls `fetch`. It adds the base URL, the JSON headers and the token, and throws `ApiError` on failure.
- **`src/lib/types.ts`** mirrors the API response types.
- **UI building blocks**: `src/components/ui/` (`Button`, `Input`, `Card`). Reuse them, and add new ones there.
- **Loading and errors**: put a `loading.tsx` (skeleton) and an `error.tsx` (error message + retry) next to a page. See `src/app/categories/`.

### Where the login token lives (Task B1)

After login, the API returns `{ accessToken, user }`. For this project we keep it simple: store the token in an **httpOnly cookie** set by a Next.js Server Action, and read it in server components with `cookies()`. Task B1 explains the steps.
