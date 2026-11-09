---
name: Development database bootstrap
description: A configured Replit development database may not yet have the schema declared in the workspace.
---

Before changing database-backed route code in response to a missing-table error, check the development database's schema. A configured `DATABASE_URL` does not prove that tables have been pushed.

**Why:** This workspace had a configured database but no public tables, so the sign-in route failed before reaching password verification. Pushing the declared development schema resolved the failure without changing existing data.

**How to apply:** Check table metadata read-only, confirm the development target, and use the normal schema push to align it with `lib/db/src/schema`. Never use a forced push or apply development schema changes directly to production.
