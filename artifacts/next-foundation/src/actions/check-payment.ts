"use server";

import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db, orders } from "@workspace/db";
import { auth } from "@/lib/auth";
import { settleOrder } from "@/lib/payments";

export async function checkPayment(reference: string): Promise<"SUCCESS" | "PENDING" | "FAILED"> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return "FAILED";

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.merchantReference, reference), eq(orders.userId, session.user.id)))
    .limit(1);
  if (!order) return "FAILED";

  try {
    const settled = await settleOrder(order);
    return settled.status;
  } catch (e) {
    console.warn("checkPayment failed:", e);
    return "PENDING"; // treat as "not yet", the next check will retry
  }
}