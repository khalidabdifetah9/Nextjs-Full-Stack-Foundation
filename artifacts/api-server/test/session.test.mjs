import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import {
  createSessionToken,
  resolveSessionAccess,
  verifySessionToken,
} from "../src/lib/session.ts";

const account = {
  id: "4d31e4f1-7fa8-4606-a1ab-c44b39174f04",
  fullName: "Taylor User",
  email: "taylor@example.com",
};

before(() => {
  process.env.SESSION_SECRET =
    "test-only-session-signing-secret-that-is-long-enough";
});

function newSession() {
  return createSessionToken(account.id, false).token;
}

describe("session access", () => {
  it("rejects a missing session without looking up an account", async () => {
    let lookedUp = false;
    const result = await resolveSessionAccess(undefined, async () => {
      lookedUp = true;
      return account;
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
        return account;
      },
      claims.exp,
    );

    assert.deepEqual(result, { kind: "unauthenticated" });
    assert.equal(lookedUp, false);
  });

  it("allows a valid session even when a legacy account is unverified", async () => {
    const result = await resolveSessionAccess(newSession(), async () => ({
      ...account,
      emailVerifiedAt: null,
    }));

    assert.deepEqual(result, {
      kind: "authenticated",
      user: {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
      },
    });
  });

  it("allows an existing account with a valid session", async () => {
    const result = await resolveSessionAccess(
      newSession(),
      async () => account,
    );

    assert.deepEqual(result, {
      kind: "authenticated",
      user: {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
      },
    });
  });

  it("rejects a session if its account no longer exists", async () => {
    const result = await resolveSessionAccess(newSession(), async () => null);

    assert.deepEqual(result, { kind: "unauthenticated" });
  });
});
