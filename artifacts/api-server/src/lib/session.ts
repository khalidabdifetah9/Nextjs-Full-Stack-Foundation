import { createHmac, randomBytes } from "node:crypto";

const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const REMEMBERED_SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

export const SESSION_COOKIE_NAME = "hueestate_session";

export function createSessionToken(
  userId: string,
  rememberMe: boolean,
): { token: string; expiresInSeconds: number; persistent: boolean } {
  const secret = process.env.SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("Session signing secret is missing or too short.");
  }

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
