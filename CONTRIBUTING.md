# How we work

## The golden rules

1. **Never push directly to `main`.** Every change goes through a pull request (PR).
2. **One task = one branch = one PR.** Small PRs get reviewed fast.
3. **Copy the reference code.** Backend: `apps/api/src/categories/`. Frontend: `apps/web/src/app/categories/`.
4. **Ask early.** Stuck for more than 30 minutes? Ask in the team chat and share the error message.

## Workflow for every task

```bash
# 1. Start from an up-to-date main
git checkout main
git pull

# 2. Create your branch
git checkout -b feat/products-api

# 3. Work, commit often
git add .
git commit -m "feat(api): add products list endpoint"

# 4. Before pushing, run the checks CI will run
pnpm lint && pnpm typecheck && pnpm test

# 5. Push and open a PR on GitHub
git push -u origin feat/products-api
```

Then on GitHub: open the PR, fill in the template, write `Closes #<issue number>` and request a review from the lead.

### Keeping your branch up to date

If `main` changed while you were working:

```bash
git checkout main && git pull
git checkout feat/products-api
git merge main        # fix conflicts if any, then commit
```

## Branch names

`<type>/<short-description>`, for example:

- `feat/products-api`
- `feat/login-page`
- `fix/cart-total`
- `docs/readme-setup`

## Commit messages ([Conventional Commits](https://www.conventionalcommits.org/))

`<type>(<scope>): <what you did>`

| type       | when                                  |
| ---------- | ------------------------------------- |
| `feat`     | a new feature                         |
| `fix`      | a bug fix                             |
| `refactor` | code change that is not a feature/fix |
| `test`     | adding or fixing tests                |
| `docs`     | documentation only                    |
| `chore`    | tooling, dependencies, config         |

Scopes: `api`, `web`, `db`, `ci`. Examples:

- `feat(api): add cart endpoints`
- `fix(web): show error when login fails`
- `chore(db): add rating column to product`

## Pull request rules

- CI (lint, typecheck, tests, build) must be green ✅
- At least **1 approval** (from the lead) before merging
- Reply to every review comment: fix it, or explain why not
- Use **"Squash and merge"** so `main` has one commit per task
- Delete your branch after merging

## Code review: what we look for

- Does it work? (the reviewer will run it)
- Does it follow the reference pattern?
- Are request bodies validated with a DTO?
- Do admin-only endpoints have `@Roles('ADMIN')`?
- Is there a unit test for the service?
- No `any`, no leftover `console.log`, no commented-out code

## Database changes

The Prisma schema (`apps/api/prisma/schema.prisma`) is shared by everyone, so:

1. Ask the lead before changing it.
2. Create the migration: `pnpm db:migrate --name add_product_rating`
3. Commit **both** `schema.prisma` and the new folder in `prisma/migrations/`.
4. After pulling someone else's migration, run `pnpm db:migrate` again.

## Secrets

Never commit `.env` / `.env.local`. If you add a new variable, add it (with a fake value) to the `.env.example` file and mention it in your PR.
