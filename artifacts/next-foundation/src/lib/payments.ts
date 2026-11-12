import { and, eq, lt } from "drizzle-orm";
import { db, orders, reservations } from "@workspace/db";
import type { Order } from "@workspace/db";
import { verifyPayment } from "./chapa";

// Holds whose time is over stop blocking the house
export async function expireStaleReservations() {
  await db
    .update(reservations)
    .set({ status: "expired" })
    .where(and(eq(reservations.status, "active"), lt(reservations.endsAt, new Date())));
}

const isUniqueViolation = (e: unknown) => {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
};

// Asks Chapa for the real payment state and updates our records.
// Safe to call many times, and later a webhook can call it too.
export async function settleOrder(order: Order): Promise<Order> {
  if (order.status !== "PENDING") return order;

  const payment = await verifyPayment(order.merchantReference);
  if (!payment) return order;

  if (payment.status === "SUCCESS") {
    const matches =
      payment.amount === order.amount &&
      payment.currency === order.currency &&
      payment.merchant_reference === order.merchantReference;

    if (!matches) {
      console.error("Payment mismatch, not activating:", order.merchantReference, payment);
      return order;
    }

    const paid = {
      status: "SUCCESS" as const,
      paidAt: new Date(),
      chapaReference: payment.chapa_reference,
      paymentMethod: payment.payment_method ?? null,
      serviceFee: payment.service_fee ?? null,
    };

    try {
      await db.transaction(async (tx) => {
        const [claimed] = await tx
          .update(orders)
          .set(paid)
          .where(and(eq(orders.id, order.id), eq(orders.status, "PENDING")))
          .returning({ id: orders.id });
        if (!claimed) return; // another request already processed it

        const now = new Date();
        const endsAt = new Date(now.getTime() + (await daysOf(tx, order.reservationId)) * 86_400_000);
        await tx
          .update(reservations)
          .set({ status: "active", startsAt: now, endsAt })
          .where(eq(reservations.id, order.reservationId));
      });
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;
      // Someone else's hold became active first. The money was taken, so it
      // needs a manual refund.
      console.error("PAID BUT HOUSE ALREADY RESERVED, refund needed:", order.merchantReference);
      await db.update(orders).set(paid).where(eq(orders.id, order.id));
      await db
        .update(reservations)
        .set({ status: "cancelled" })
        .where(eq(reservations.id, order.reservationId));
    }
  } else if (["FAILED", "CANCELLED", "BLOCKED"].includes(payment.status)) {
    await db.update(orders).set({ status: "FAILED" }).where(eq(orders.id, order.id));
    await db
      .update(reservations)
      .set({ status: "cancelled" })
      .where(eq(reservations.id, order.reservationId));
  }
  // PENDING / INCOMPLETE: the customer may still finish, so we leave it as is

  const [fresh] = await db.select().from(orders).where(eq(orders.id, order.id)).limit(1);
  return fresh ?? order;
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
async function daysOf(tx: Tx, reservationId: string) {
  const [r] = await tx
    .select({ days: reservations.days })
    .from(reservations)
    .where(eq(reservations.id, reservationId))
    .limit(1);
  return r.days;
}