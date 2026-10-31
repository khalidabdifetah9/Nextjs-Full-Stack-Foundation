# Next.js Foundation

A minimal Next.js App Router starter configured for this Replit workspace. It
includes TypeScript, Tailwind CSS, Framer Motion, and ESLint, with no database,
authentication, or product features.

## Run and check

From the workspace root:

```sh
pnpm --filter @workspace/next-foundation run dev
pnpm --filter @workspace/next-foundation run lint
pnpm --filter @workspace/next-foundation run typecheck
pnpm --filter @workspace/next-foundation run build
pnpm --filter @workspace/next-foundation run start
```

The Replit-managed web workflow runs the same `dev` script. It provides the
artifact's `PORT` and `BASE_PATH`; Next listens on `0.0.0.0` and uses the base
path setting for preview routing.

## Project structure

- `src/app/` — App Router root layout, global stylesheet, and neutral preview
  route.
- `src/lib/` — place shared server-side utilities here when the application
  needs them.
- `src/components/` — add reusable UI only when a product feature calls for it.
- `public/` — static files, such as images and icons.
- `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`,
  `tsconfig.json` — framework, Tailwind, lint, and TypeScript configuration.
- `.replit-artifact/artifact.toml` — Replit preview workflow, ports, and
  production commands.

## Environment variables

No environment variables or secrets are required by the starter. For local
development, copy `.env.example` to `.env.local` and add values only when a
feature needs them. For Replit, store real values in Replit Secrets.

Keep credentials server-side and read them only from server code. Next.js
exposes variables prefixed with `NEXT_PUBLIC_` to browser code, so use that
prefix only for values that are intentionally public. `.env.local` and other
`.env*` files are ignored; `.env.example` contains guidance only.
