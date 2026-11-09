import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const REMEMBERED_SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

export const SESSION_COOKIE_NAME = "hueestate_session";

export type SessionClaims = {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
};

export type SessionAccount = {
  id: string;
  fullName: string;
  email: string;
  emailVerifiedAt: Date | null;
};

export type SessionAccess =
  | { kind: "unauthenticated" }
  | { kind: "email-unverified" }
  | {
      kind: "authenticated";
      user: Pick<SessionAccount, "id" | "fullName" | "email">;
    };

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("Session signing secret is missing or too short.");
  }
  return secret;
}

export function createSessionToken(
  userId: string,
  rememberMe: boolean,
): { token: string; expiresInSeconds: number; persistent: boolean } {
  const secret = getSessionSecret();

  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresInSeconds = rememberMe
    ? REMEMBERED_SESSION_DURATION_SECONDS
    : SESSION_DURATION_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      iat: issuedAt,
      exp: issuedAt + expiresInSeconds,
      jti: randomBytes(16).toString("base64url"),
    }),
  ).toString("base64url");
  const signedContent = `v1.${payload}`;
  const signature = createHmac("sha256", secret)
    .update(signedContent)
    .digest("base64url");

  return {
    token: `${signedContent}.${signature}`,
    expiresInSeconds,
    persistent: rememberMe,
  };
}

export function verifySessionToken(
  token: unknown,
  nowSeconds = Math.floor(Date.now() / 1000),
): SessionClaims | null {
  if (typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    parts[0] !== "v1" ||
    !/^[A-Za-z0-9_-]+$/.test(parts[1]) ||
    !/^[A-Za-z0-9_-]+$/.test(parts[2])
  ) {
    return null;
  }

  const [, payload, suppliedSignature] = parts;
  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(`v1.${payload}`)
    .digest();
  const signatureBytes = Buffer.from(suppliedSignature, "base64url");
  if (
    signatureBytes.length !== expectedSignature.length ||
    !timingSafeEqual(signatureBytes, expectedSignature)
  ) {
    return null;
  }

  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (!claims || typeof claims !== "object") {
    return null;
  }

  const candidate = claims as Partial<SessionClaims>;
  if (
    typeof candidate.sub !== "string" ||
    candidate.sub.length === 0 ||
    typeof candidate.iat !== "number" ||
    !Number.isSafeInteger(candidate.iat) ||
    typeof candidate.exp !== "number" ||
    !Number.isSafeInteger(candidate.exp) ||
    candidate.exp <= candidate.iat ||
    candidate.exp - candidate.iat > REMEMBERED_SESSION_DURATION_SECONDS ||
    candidate.iat > nowSeconds ||
    candidate.exp <= nowSeconds ||
    typeof candidate.jti !== "string" ||
    candidate.jti.length === 0
  ) {
    return null;
  }

  return candidate as SessionClaims;
}

export async function resolveSessionAccess(
  token: unknown,
  findAccount: (userId: string) => Promise<SessionAccount | null>,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<SessionAccess> {
  const claims = verifySessionToken(token, nowSeconds);
  if (!claims) {
    return { kind: "unauthenticated" };
  }

  const account = await findAccount(claims.sub);
  if (!account) {
    return { kind: "unauthenticated" };
  }

  if (!account.emailVerifiedAt) {
    return { kind: "email-unverified" };
  }

  return {
    kind: "authenticated",
    user: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
    },
  };
}
