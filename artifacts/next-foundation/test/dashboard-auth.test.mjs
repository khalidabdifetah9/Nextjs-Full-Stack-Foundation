import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { requireDashboardSession } from "../src/lib/dashboard-auth.ts";

const dashboardDirectory = new URL("../src/app/dashboard/", import.meta.url);

function createRedirect() {
  return (path) => {
    throw new Error(`REDIRECT:${path}`);
  };
}

describe("dashboard session guard", () => {
  it("guards both the dashboard home and nested dashboard pages", async () => {
    const layout = await readFile(
      new URL("layout.tsx", dashboardDirectory),
      "utf8",
    );

    assert.match(layout, /requireDashboardSession/);
    for (const page of ["page.tsx", "schedule/page.tsx"]) {
      await access(new URL(page, dashboardDirectory));
    }
  });

  it("redirects missing, invalid, and expired sessions to sign in", async () => {
    await assert.rejects(
      requireDashboardSession(
        async () => ({ status: 401, ok: false }),
        createRedirect(),
      ),
      /REDIRECT:\/signin/,
    );
  });

  it("does not send users to email verification for an active session", async () => {
    await assert.rejects(
      requireDashboardSession(
        async () => ({ status: 403, ok: false }),
        createRedirect(),
      ),
      /Unable to validate dashboard session/,
    );
  });

  it("allows an active session and fails closed on API errors", async () => {
    await assert.doesNotReject(
      requireDashboardSession(
        async () => ({ status: 200, ok: true }),
        createRedirect(),
      ),
    );

    await assert.rejects(
      requireDashboardSession(
        async () => ({ status: 500, ok: false }),
        createRedirect(),
      ),
      /Unable to validate dashboard session/,
    );
  });
});
