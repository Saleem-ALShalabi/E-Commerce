# API (NestJS)

See the [root README](../../README.md) for setup and [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for how the code is organized.

- Runs on http://localhost:3001/api. Swagger docs are at http://localhost:3001/api/docs
- Reference module to copy: `src/categories/`
- Database schema: `prisma/schema.prisma`. Demo data: `prisma/seed.ts`

```bash
pnpm dev            # watch mode
pnpm test           # unit tests (Vitest)
pnpm test:watch     # re-run tests on save
pnpm lint           # oxlint
pnpm prisma:studio  # browse the database
```

NestJS docs: https://docs.nestjs.com · Prisma docs: https://www.prisma.io/docs
