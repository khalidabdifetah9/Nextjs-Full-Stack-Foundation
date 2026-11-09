import { GetCurrentSessionResponse } from "@workspace/api-zod";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { resolveSessionAccess, SESSION_COOKIE_NAME } from "../lib/session";

const router: IRouter = Router();

router.get("/auth/session", async (req, res): Promise<void> => {
  try {
    const access = await resolveSessionAccess(
      req.cookies?.[SESSION_COOKIE_NAME],
      async (userId) => {
        const [account] = await db
          .select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            emailVerifiedAt: users.emailVerifiedAt,
          })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        return account ?? null;
      },
    );

    if (access.kind === "unauthenticated") {
      res.status(401).json({ error: "Sign in is required." });
      return;
    }

    if (access.kind === "email-unverified") {
      res.status(403).json({ error: "Verify your email to continue." });
      return;
    }

    res.status(200).json(GetCurrentSessionResponse.parse({ user: access.user }));
  } catch (error) {
    req.log.error(
      { errorType: error instanceof Error ? error.name : "UnknownError" },
      "Session validation failed",
    );
    res.status(500).json({ error: "Unable to validate the session." });
  }
});

export default router;
