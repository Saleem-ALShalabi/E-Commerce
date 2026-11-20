# Web (Next.js)

See the [root README](../../README.md) for setup and [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for how the code is organized.

- Runs on http://localhost:3000 and needs the API running on :3001
- Reference page to copy: `src/app/categories/` (page + loading + error)
- All API calls go through `src/lib/api.ts`. Response types live in `src/lib/types.ts`
- UI building blocks: `src/components/ui/`

```bash
pnpm dev        # dev server
pnpm lint       # ESLint
pnpm typecheck  # TypeScript
pnpm build      # production build
```

Next.js docs: https://nextjs.org/docs · Tailwind docs: https://tailwindcss.com/docs
