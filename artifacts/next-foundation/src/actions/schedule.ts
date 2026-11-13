"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, count, eq, gte } from "drizzle-orm";
import { appointments, db, houses } from "@workspace/db";
import { auth } from "@/lib/auth";
import {
  MAX_UPCOMING,
  businessNow,
  fromKey,
  isClosedDay,
  isSlotPast,
  timeSlots,
  toKey,
} from "@/lib/schedule";

type Result = { ok: true } | { error: string };

const isUniqueViolation = (e: unknown) => {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
};

function refresh() {
  revalidatePath("/dashboard/schedule");
  revalidatePath("/dashboard/activity");
}

export async function bookAppointment(input: {
  date: string;
  time: string;
  houseId: string | null;
  note: string;
}): Promise<Result> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Please sign in to continue." };

  const { date, time } = input;

  // Validate everything on the server
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && toKey(fromKey(date)) === date;
  if (!validDate || !timeSlots.includes(time)) return { error: "Please choose a valid date and time." };
  if (isClosedDay(date)) return { error: "We are closed on that day." };
  if (isSlotPast(date, time)) return { error: "That time has already passed." };

  // The topic comes from the database, never from the browser
  let houseId: string | null = null;
  let topic = "General consultation";
  if (input.houseId) {
    const [house] = await db
      .select({ id: houses.id, name: houses.name })
      .from(houses)
      .where(eq(houses.id, input.houseId))
      .limit(1);
    if (!house) return { error: "That home could not be found." };
    houseId = house.id;
    topic = `Viewing: ${house.name}`;
  }

  // Limit how many upcoming appointments one person can hold
  const [{ n }] = await db
    .select({ n: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.userId, session.user.id),
        eq(appointments.status, "booked"),
        gte(appointments.date, businessNow().date)
      )
    );
  if (n >= MAX_UPCOMING) {
    return { error: `You can have up to ${MAX_UPCOMING} upcoming appointments. Cancel one to book another.` };
  }

  try {
    await db.insert(appointments).values({
      userId: session.user.id,
      houseId,
      date,
      time,
      topic,
      note: input.note.trim().slice(0, 500) || null,
    });
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "That time was just taken. Please choose another." };
    console.error("bookAppointment failed:", e);
    return { error: "We couldn't save your appointment. Please try again." };
  }

  refresh();
  return { ok: true };
}

export async function cancelAppointment(id: string): Promise<Result> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Please sign in to continue." };

  // Only your own, still-booked, upcoming appointments can be cancelled
  const cancelled = await db
    .update(appointments)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(appointments.id, id),
        eq(appointments.userId, session.user.id),
        eq(appointments.status, "booked"),
        gte(appointments.date, businessNow().date)
      )
    )
    .returning({ id: appointments.id });

  if (cancelled.length === 0) return { error: "That appointment can't be cancelled." };

  refresh();
  return { ok: true };
}