"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db, houses, orders, reservations } from "@workspace/db";
import { auth } from "@/lib/auth";
import { createHostedCheckout } from "@/lib/chapa";
import { expireStaleReservations } from "@/lib/payments";
import { MAX_DAYS, MIN_DAYS, PRICE_PER_DAY_ETB, toCents } from "@/lib/pricing";

type Result = { checkoutUrl: string } | { error: string };

// Chapa wants "2519XXXXXXXX". We only send it when it looks right.
function chapaPhone(phone?: string | null) {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `251${digits.slice(1)}`;
  return /^251\d{9}$/.test(digits) ? digits : undefined;
}

export async function reserveHouse(houseId: string, days: number): Promise<Result> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Please sign in to continue." };

  // Never trust the browser: validate and recalculate everything here
  if (!Number.isInteger(days) || days < MIN_DAYS || days > MAX_DAYS) {
    return { error: `Choose between ${MIN_DAYS} and ${MAX_DAYS} days.` };
  }

  const [house] = await db.select().from(houses).where(eq(houses.id, houseId)).limit(1);
  if (!house) return { error: "This home can't be reserved yet." };

  await expireStaleReservations();
  const [taken] = await db
    .select({ id: reservations.id })
    .from(reservations)
    .where(and(eq(reservations.houseId, house.id), eq(reservations.status, "active")))
    .limit(1);
  if (taken) return { error: "This home is already reserved by someone else." };

  const amount = toCents(days * PRICE_PER_DAY_ETB);
  const merchantReference = `HUE-${randomBytes(6).toString("hex")}`.toUpperCase(); // 16 chars

  const [reservation] = await db
    .insert(reservations)
    .values({ userId: session.user.id, houseId: house.id, days })
    .returning({ id: reservations.id });

  const [order] = await db
    .insert(orders)
    .values({
      merchantReference,
      userId: session.user.id,
      reservationId: reservation.id,
      amount,
      currency: "ETB",
      customerEmail: session.user.email,
    })
    .returning();

  const [firstName, ...rest] = session.user.name.trim().split(" ");

  try {
    const { checkoutUrl, chapaReference } = await createHostedCheckout({
      idempotencyKey: order.id, // a retry of this order reuses the same key
      amount,
      currency: "ETB",
      merchantReference,
      returnUrl: `${process.env.BETTER_AUTH_URL}/dashboard/payment/success?ref=${merchantReference}`,
      title: "House reservation",
      description: `${days} day hold - ${house.name}`.slice(0, 100),
      customer: {
        first_name: firstName,
        last_name: rest.join(" ") || firstName,
        email: session.user.email,
        phone_number: chapaPhone(session.user.phone),
      },
      meta: { order_id: order.id, reservation_id: reservation.id },
    });

    await db.update(orders).set({ checkoutUrl, chapaReference }).where(eq(orders.id, order.id));
    return { checkoutUrl };
  } catch (e) {
    console.error("RESERVE FAILED:", e);
    await db.update(orders).set({ status: "FAILED" }).where(eq(orders.id, order.id));
    await db.update(reservations).set({ status: "cancelled" }).where(eq(reservations.id, reservation.id));
    return { error: e instanceof Error ? e.message : "Could not start the payment." };
  }
}