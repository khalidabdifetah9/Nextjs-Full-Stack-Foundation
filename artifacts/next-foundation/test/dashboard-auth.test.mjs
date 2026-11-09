import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { requireVerifiedDashboardSession } from "../src/lib/dashboard-auth.ts";

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

    assert.match(layout, /requireVerifiedDashboardSession/);
    for (const page of ["page.tsx", "schedule/page.tsx"]) {
      await access(new URL(page, dashboardDirectory));
    }
  });

  it("redirects missing, invalid, and expired sessions to sign in", async () => {
    await assert.rejects(
      requireVerifiedDashboardSession(
        async () => ({ status: 401, ok: false }),
        createRedirect(),
      ),
      /REDIRECT:\/signin/,
    );
  });

  it("redirects a valid session with an unverified email to instructions", async () => {
    await assert.rejects(
      requireVerifiedDashboardSession(
        async () => ({ status: 403, ok: false }),
        createRedirect(),
      ),
      /REDIRECT:\/verify-email/,
    );
  });

  it("allows a verified session and fails closed on API errors", async () => {
    await assert.doesNotReject(
      requireVerifiedDashboardSession(
        async () => ({ status: 200, ok: true }),
        createRedirect(),
      ),
    );

    await assert.rejects(
      requireVerifiedDashboardSession(
        async () => ({ status: 500, ok: false }),
        createRedirect(),
      ),
      /Unable to validate dashboard session/,
    );
  });
});
