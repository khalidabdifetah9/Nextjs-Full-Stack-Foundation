import { SignInUserBody, SignInUserResponse } from "@workspace/api-zod";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";
import { verifyPassword } from "../lib/password";
import { createSessionToken, SESSION_COOKIE_NAME } from "../lib/session";

const router: IRouter = Router();

function normalizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const input = body as Record<string, unknown>;
  return {
    ...input,
    email:
      typeof input.email === "string"
        ? input.email.trim().toLowerCase()
        : input.email,
  };
}

router.post("/auth/signin", async (req, res): Promise<void> => {
  const parsed = SignInUserBody.strict().safeParse(normalizeBody(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid sign-in request." });
    return;
  }

  const { email, password, rememberMe = false } = parsed.data;

  try {
    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const passwordMatches = await verifyPassword(
      password,
      user?.passwordHash,
    );
    if (!user || !passwordMatches) {
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }

    const response = SignInUserResponse.parse({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
    const session = createSessionToken(user.id, rememberMe);

    res.cookie(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(session.persistent
        ? { maxAge: session.expiresInSeconds * 1000 }
        : {}),
    });
    res.status(200).json(response);
  } catch (error) {
    const errorCode =
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined;
    logger.error(
      {
        errorType: error instanceof Error ? error.name : "UnknownError",
        ...(errorCode ? { errorCode } : {}),
      },
      "Account sign-in failed",
    );
    res.status(500).json({ error: "Unable to sign in right now." });
  }
});

export default router;
