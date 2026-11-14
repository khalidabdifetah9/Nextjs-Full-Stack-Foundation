import { getAdminActivity } from "@/lib/admin-queries";
import { formatTime, fromKey } from "@/lib/schedule";

const etb = (cents: number) => `ETB ${(cents / 100).toLocaleString("en-US")}`;
const shortDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {count !== undefined && <span className="font-mono text-xs text-[#243D35]/50">{count}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl bg-[#F7F6F2] p-6 text-center text-sm text-[#243D35]/70">{text}</p>;
}

function Contact({ phone, email }: { phone: string | null; email: string }) {
  return (
    <div className="text-sm">
      {phone ? (
        <a href={telHref(phone)} className="font-medium underline underline-offset-4">
          {phone}
        </a>
      ) : (
        <span className="text-[#243D35]/50">No phone number</span>
      )}
      <p className="mt-0.5 break-all text-xs text-[#243D35]/60">{email}</p>
    </div>
  );
}

export default async function AdminActivity() {
  const { today, tomorrow, meetings, holds, payments, revenue } = await getAdminActivity();

  // The list is already sorted by date, so group neighbours
  const days: { date: string; items: typeof meetings }[] = [];
  for (const m of meetings) {
    const last = days[days.length - 1];
    if (last && last.date === m.date) last.items.push(m);
    else days.push({ date: m.date, items: [m] });
  }

  const stats = [
    { label: "Appointments today", value: String(meetings.filter((m) => m.date === today).length) },
    { label: "Upcoming appointments", value: String(meetings.length) },
    { label: "Active reservations", value: String(holds.length) },
    { label: "Total received", value: etb(revenue) },
  ];

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">Admin</p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Client activity</h1>
        <p className="text-base text-[#243D35]/70">
          Who is coming, who reserved a home and who has paid. Tap a phone number to call.
        </p>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5">
            <dt className="text-sm text-[#243D35]/60">{s.label}</dt>
            <dd className="mt-2 text-2xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* Appointments, grouped by day */}
      <Section title="Upcoming appointments" count={meetings.length}>
        {days.length === 0 ? (
          <Empty text="No upcoming appointments." />
        ) : (
          <div className="space-y-6">
            {days.map((day) => {
              const label = day.date === today ? "Today" : day.date === tomorrow ? "Tomorrow" : null;
              return (
                <div key={day.date}>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-semibold">
                      {fromKey(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    {label && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          label === "Today" ? "bg-[#243D35] text-white" : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {label}
                      </span>
                    )}
                  </div>

                  <ul className="divide-y divide-[#243D35]/10 rounded-xl border border-[#243D35]/10">
                    {day.items.map((m) => (
                      <li key={m.id} className="grid gap-3 p-4 sm:grid-cols-[90px_1fr_auto] sm:items-start">
                        <p className="font-mono text-sm font-semibold">{formatTime(m.time)}</p>
                        <div className="min-w-0">
                          <p className="font-medium">{m.name}</p>
                          <p className="truncate text-sm text-[#243D35]/60">{m.topic}</p>
                          {m.note && (
                            <p className="mt-1 text-sm italic text-[#243D35]/70">&ldquo;{m.note}&rdquo;</p>
                          )}
                        </div>
                        <Contact phone={m.phone} email={m.email} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Reserved homes" count={holds.length}>
          {holds.length === 0 ? (
            <Empty text="No homes are reserved right now." />
          ) : (
            <ul className="divide-y divide-[#243D35]/10">
              {holds.map((h) => (
                <li key={h.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{h.houseName}</p>
                    <p className="text-sm text-[#243D35]/60">
                      {h.name} · {h.days} {h.days === 1 ? "day" : "days"}
                    </p>
                    <p className="mt-1 text-sm">
                      Held until {shortDate(h.endsAt)}{" "}
                      <span className="text-[#243D35]/60">
                        ({h.daysLeft} {h.daysLeft === 1 ? "day" : "days"} left)
                      </span>
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#243D35]/50">
                      {etb(h.amount)} · {h.ref}
                    </p>
                  </div>
                  <Contact phone={h.phone} email={h.email} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Latest payments" count={payments.length}>
          {payments.length === 0 ? (
            <Empty text="No payments yet." />
          ) : (
            <ul className="divide-y divide-[#243D35]/10">
              {payments.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="truncate text-sm text-[#243D35]/60">{p.houseName}</p>
                    <p className="font-mono text-xs text-[#243D35]/50">
                      {shortDate(p.paidAt)} · {p.ref}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold">{etb(p.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}