import type {Metadata} from "next"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, asc, eq, gte } from "drizzle-orm";
import { appointments, db, houses } from "@workspace/db";
import { auth } from "@/lib/auth";
import { businessNow } from "@/lib/schedule";
import ScheduleBooking from "@/components/dashboard/schedule/ScheduleBooking";

export const metadata:Metadata = { title: "Make a Schedule | HueEstate" };

export default async function SchedulePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const today = businessNow().date;
  const upcoming = and(eq(appointments.status, "booked"), gte(appointments.date, today));

  const taken = await db
    .select({ date: appointments.date, time: appointments.time })
    .from(appointments)
    .where(upcoming);

  const booked: Record<string, string[]> = {};
  for (const t of taken) (booked[t.date] ??= []).push(t.time);

  const mine = await db
    .select({
      id: appointments.id,
      date: appointments.date,
      time: appointments.time,
      topic: appointments.topic,
    })
    .from(appointments)
    .where(and(upcoming, eq(appointments.userId, session.user.id)))
    .orderBy(asc(appointments.date), asc(appointments.time));

  const homes = await db
    .select({ id: houses.id, name: houses.name })
    .from(houses)
    .orderBy(asc(houses.name));

  return <ScheduleBooking booked={booked} mine={mine} homes={homes} />;
}