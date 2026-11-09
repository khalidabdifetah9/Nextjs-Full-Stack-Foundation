import { RegisterUserBody, RegisterUserResponse } from "@workspace/api-zod";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";
import { hashPassword } from "../lib/password";

const router: IRouter = Router();

function normalizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const input = body as Record<string, unknown>;
  return {
    ...input,
    fullName:
      typeof input.fullName === "string"
        ? input.fullName.trim()
        : input.fullName,
    email:
      typeof input.email === "string"
        ? input.email.trim().toLowerCase()
        : input.email,
    phone:
      typeof input.phone === "string"
        ? input.phone.trim() || undefined
        : input.phone,
  };
}

function meetsPasswordStrength(password: string): boolean {
  const rules = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return rules.filter(Boolean).length >= 3;
}

function isUniqueViolation(
  error: unknown,
  constraint: "users_email_unique" | "users_phone_unique",
): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const databaseError = error as { code?: unknown; constraint?: unknown };
  return databaseError.code === "23505" && databaseError.constraint === constraint;
}

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterUserBody.strict().safeParse(normalizeBody(req.body));

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { fullName, email, password, phone } = parsed.data;
  if (!meetsPasswordStrength(password)) {
    return res.status(400).json({
      error: "Invalid request",
      issues: [
        {
          path: "password",
          message: "Password must satisfy at least three strength rules.",
        },
      ],
    });
  }

  try {
    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    if (phone) {
      const existingPhone = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      if (existingPhone.length > 0) {
        return res
          .status(409)
          .json({ error: "An account with this phone number already exists." });
      }
    }

    const passwordHash = await hashPassword(password);
    const [createdUser] = await db
      .insert(users)
      .values({
        fullName,
        email,
        ...(phone ? { phone } : {}),
        passwordHash,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
      });

    const response = RegisterUserResponse.parse(createdUser);
    return res.status(201).json(response);
  } catch (error) {
    if (isUniqueViolation(error, "users_email_unique")) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    if (isUniqueViolation(error, "users_phone_unique")) {
      return res
        .status(409)
        .json({ error: "An account with this phone number already exists." });
    }

    logger.error(
      {
        errorType: error instanceof Error ? error.name : "UnknownError",
      },
      "Account registration failed",
    );
    return res.status(500).json({ error: "Unable to create account." });
  }
});

export default router;
