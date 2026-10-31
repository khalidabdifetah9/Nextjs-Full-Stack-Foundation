---
name: Next.js Replit workflow
description: Replit artifact routing and Next.js development preview configuration.
---

The generic web artifact bootstrap in this workspace is Vite-based. For an explicitly requested Next.js app, replace its Vite files and dependencies, then configure the managed artifact to run `next dev` and `next start` rather than serving a static directory.

For proxied Next.js development previews, include localhost and the runtime `REPLIT_DEV_DOMAIN` in `allowedDevOrigins`. A broad `*.replit.dev` pattern alone may not match Replit's multi-label forwarded hostname; avoid allowing every origin.

**Why:** Replit's preview proxy presents a host distinct from the local server origin, and Next.js blocks cross-origin development resources by default. The page can return successfully while HMR still fails.

**How to apply:** Keep the artifact's managed `PORT` and `BASE_PATH`, configure server-based production commands, allow the exact runtime development host, and confirm the preview's HMR connection.
