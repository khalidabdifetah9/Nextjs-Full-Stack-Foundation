import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import {
  createSessionToken,
  resolveSessionAccess,
  verifySessionToken,
} from "../src/lib/session.ts";

const verifiedAccount = {
  id: "4d31e4f1-7fa8-4606-a1ab-c44b39174f04",
  fullName: "Taylor User",
  email: "taylor@example.com",
  emailVerifiedAt: new Date("2026-01-01T00:00:00.000Z"),
};

before(() => {
  process.env.SESSION_SECRET =
    "test-only-session-signing-secret-that-is-long-enough";
});

function newSession() {
  return createSessionToken(verifiedAccount.id, false).token;
}

describe("session access", () => {
  it("rejects a missing session without looking up an account", async () => {
    let lookedUp = false;
    const result = await resolveSessionAccess(undefined, async () => {
      lookedUp = true;
      return verifiedAccount;
    });

    assert.deepEqual(result, { kind: "unauthenticated" });
    assert.equal(lookedUp, false);
  });

  it("rejects a malformed or tampered session", async () => {
    const token = newSession();
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
    const result = await resolveSessionAccess(tampered, async () => verifiedAccount);

    assert.deepEqual(result, { kind: "unauthenticated" });
    assert.equal(verifySessionToken("not-a-session"), null);
  });

  it("rejects an expired session before account lookup", async () => {
    const token = newSession();
    const claims = verifySessionToken(token);
    assert.ok(claims);

    let lookedUp = false;
    const result = await resolveSessionAccess(
      token,
      async () => {
        lookedUp = true;
        return verifiedAccount;
      },
      claims.exp,
    );

    assert.deepEqual(result, { kind: "unauthenticated" });
    assert.equal(lookedUp, false);
  });

  it("requires email verification for a valid session", async () => {
    const result = await resolveSessionAccess(newSession(), async () => ({
      ...verifiedAccount,
      emailVerifiedAt: null,
    }));

    assert.deepEqual(result, { kind: "email-unverified" });
  });

  it("allows a verified account with a valid session", async () => {
    const result = await resolveSessionAccess(
      newSession(),
      async () => verifiedAccount,
    );

    assert.deepEqual(result, {
      kind: "authenticated",
      user: {
        id: verifiedAccount.id,
        fullName: verifiedAccount.fullName,
        email: verifiedAccount.email,
      },
    });
  });

  it("rejects a session if its account no longer exists", async () => {
    const result = await resolveSessionAccess(newSession(), async () => null);

    assert.deepEqual(result, { kind: "unauthenticated" });
  });
});
