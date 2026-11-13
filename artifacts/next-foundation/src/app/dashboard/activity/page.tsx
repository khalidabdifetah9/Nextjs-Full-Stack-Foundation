import type {Metadata} from "next" 
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, inArray } from "drizzle-orm";
import { appointments, db, houses, orders, reservations } from "@workspace/db";
import { auth } from "@/lib/auth";
import { expireStaleReservations } from "@/lib/payments";
import { businessNow, formatTime, fromKey } from "@/lib/schedule";

export const metadata:Metadata = { title: "My Activity | HueEstate" };

const etb = (cents: number) => `ETB ${(cents / 100).toLocaleString("en-US")}`;
const day = (d: Date | null) =>
  d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

async function loadActivity(userId: string) {
  await expireStaleReservations();
  const now = Date.now();
  const bizNow = businessNow();

  const [paid, holds, visits] = await Promise.all([
    db
      .select({ order: orders, houseName: houses.name })
      .from(orders)
      .innerJoin(reservations, eq(reservations.id, orders.reservationId))
      .innerJoin(houses, eq(houses.id, reservations.houseId))
      .where(and(eq(orders.userId, userId), eq(orders.status, "SUCCESS")))
      .orderBy(desc(orders.paidAt)),
    db
      .select({ r: reservations, houseName: houses.name, location: houses.location })
      .from(reservations)
      .innerJoin(houses, eq(houses.id, reservations.houseId))
      .where(
        and(eq(reservations.userId, userId), inArray(reservations.status, ["active", "expired"]))
      )
      .orderBy(desc(reservations.startsAt)),
    db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.date), desc(appointments.time))
      .limit(30),
  ]);

  const payments = paid.map(({ order, houseName }) => ({
    id: order.id,
    ref: order.merchantReference,
    houseName,
    amount: order.amount,
    paidAt: order.paidAt,
  }));

  const reserved = holds.map(({ r, houseName, location }) => {
    const live = r.status === "active" && !!r.endsAt && r.endsAt.getTime() > now;
    return {
      id: r.id,
      houseName,
      location,
      days: r.days,
      endsAt: r.endsAt,
      live,
      daysLeft: live && r.endsAt ? Math.ceil((r.endsAt.getTime() - now) / 86_400_000) : 0,
    };
  });

  const meetings = visits.map((v) => {
    const upcoming = v.date > bizNow.date || (v.date === bizNow.date && v.time > bizNow.time);
    const state = v.status === "cancelled" ? "Cancelled" : upcoming ? "Upcoming" : "Completed";
    return { id: v.id, date: v.date, time: v.time, topic: v.topic, state };
  });

  return {
    payments,
    reserved,
    meetings,
    totalPaid: payments.reduce((sum, p) => sum + p.amount, 0),
    activeHolds: reserved.filter((r) => r.live).length,
    upcoming: meetings.filter((m) => m.state === "Upcoming").length,
  };
}

const badge: Record<string, string> = {
  Upcoming: "bg-emerald-50 text-emerald-700",
  Completed: "bg-[#F7F6F2] text-[#243D35]/70",
  Cancelled: "bg-red-50 text-red-700",
  Active: "bg-emerald-50 text-emerald-700",
  Expired: "bg-[#F7F6F2] text-[#243D35]/70",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 sm:p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="rounded-xl bg-[#F7F6F2] p-6 text-center">
      <p className="text-sm text-[#243D35]/70">{text}</p>
      <Link href={href} className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
        {cta}
      </Link>
    </div>
  );
}

export default async function ActivityPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const { payments, reserved, meetings, totalPaid, activeHolds, upcoming } =
    await loadActivity(session.user.id);

  const stats = [
    { label: "Active reservations", value: String(activeHolds) },
    { label: "Upcoming appointments", value: String(upcoming) },
    { label: "Total paid", value: etb(totalPaid) },
  ];

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">
          My Activity
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Everything you&apos;ve done
        </h1>
        <p className="text-base text-[#243D35]/70">
          Your reservations, payments and appointments in one place.
        </p>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5">
            <dt className="text-sm text-[#243D35]/60">{s.label}</dt>
            <dd className="mt-2 text-2xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Reserved homes">
          {reserved.length === 0 ? (
            <Empty text="You haven't reserved a home yet." href="/dashboard" cta="Browse homes" />
          ) : (
            <ul className="divide-y divide-[#243D35]/10">
              {reserved.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.houseName}</p>
                    <p className="truncate text-sm text-[#243D35]/60">{r.location}</p>
                    <p className="mt-1 text-sm text-[#243D35]/60">
                      {r.days} {r.days === 1 ? "day" : "days"} · held until {day(r.endsAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge[r.live ? "Active" : "Expired"]}`}>
                      {r.live ? "Active" : "Expired"}
                    </span>
                    {r.live && (
                      <p className="mt-2 text-xs text-[#243D35]/60">
                        {r.daysLeft} {r.daysLeft === 1 ? "day" : "days"} left
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Payments">
          {payments.length === 0 ? (
            <Empty text="No completed payments yet." href="/dashboard" cta="Reserve a home" />
          ) : (
            <ul className="divide-y divide-[#243D35]/10">
              {payments.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.houseName}</p>
                    <p className="text-sm text-[#243D35]/60">
                      {day(p.paidAt)} · {p.ref}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold">{etb(p.amount)}</p>
                    <Link
                      href={`/dashboard/payment?ref=${p.ref}`}
                      className="text-xs underline underline-offset-4"
                    >
                      View receipt
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Appointments">
        {meetings.length === 0 ? (
          <Empty text="You haven't booked an appointment yet." href="/dashboard/schedule" cta="Make a schedule" />
        ) : (
          <ul className="divide-y divide-[#243D35]/10">
            {meetings.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {fromKey(m.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {formatTime(m.time)}
                  </p>
                  <p className="truncate text-sm text-[#243D35]/60">{m.topic}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badge[m.state]}`}>
                  {m.state}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}