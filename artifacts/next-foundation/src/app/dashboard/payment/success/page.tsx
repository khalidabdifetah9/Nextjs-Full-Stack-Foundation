import Link from "next/link";
import type {Metadata} from "next"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, houses, orders, reservations } from "@workspace/db";
import { auth } from "@/lib/auth";
import { settleOrder } from "@/lib/payments";
import PrintButton from "@/components/payment/PrintButton";

export const metadata:Metadata = { title: "Payment | HueEstate" };

const etb = (cents: number) =>
  `ETB ${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const when = (d: Date | null) =>
  d
    ? d.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })
    : "—";

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const { ref } = await searchParams;
  if (!ref) redirect("/dashboard");

  // Only the owner can see an order
  const [found] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.merchantReference, ref), eq(orders.userId, session.user.id)))
    .limit(1);
  if (!found) redirect("/dashboard");

  // The redirect is not proof of payment: ask Chapa on the server
  const order = await settleOrder(found);

  const [row] = await db
    .select({ reservation: reservations, house: houses })
    .from(reservations)
    .innerJoin(houses, eq(houses.id, reservations.houseId))
    .where(eq(reservations.id, order.reservationId))
    .limit(1);
  if (!row) redirect("/dashboard");
  const { reservation, house } = row;

  // --- Not paid yet ---
  if (order.status === "PENDING") {
    return (
      <Message
        title="We haven't received your payment yet"
        text="If you just paid, it can take a moment to confirm. Check again in a few seconds."
        action={
          <Link
            href={`/dashboard/payment/success?ref=${order.merchantReference}`}
            className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white"
          >
            Check again
          </Link>
        }
      />
    );
  }

  // --- Failed ---
  if (order.status === "FAILED") {
    return (
      <Message
        title="Payment was not completed"
        text="You haven't been charged for a reservation. You can try again at any time."
        action={
          <Link href="/dashboard" className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white">
            Back to homes
          </Link>
        }
      />
    );
  }

  // --- Paid, but the house was taken first (rare) ---
  if (reservation.status === "cancelled") {
    return (
      <Message
        title="This home was reserved by someone else"
        text={`Your payment (${order.merchantReference}) went through just after another reservation. Contact us with this reference and we will refund you.`}
        action={
          <Link href="/contact-us" className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white">
            Contact support
          </Link>
        }
      />
    );
  }

  // --- Receipt ---
  const rows: [string, string][] = [
    ["Receipt no.", order.merchantReference],
    ["Paid on", when(order.paidAt)],
    ["Name", session.user.name],
    ["Email", order.customerEmail],
    ["Home", house.name],
    ["Location", house.location],
    ["Reservation", `${reservation.days} ${reservation.days === 1 ? "day" : "days"}`],
    ["Held from", when(reservation.startsAt)],
    ["Held until", when(reservation.endsAt)],
    ["Payment method", order.paymentMethod ?? "—"],
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="print:hidden">
        <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">Payment</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Reservation confirmed</h1>
        <p className="mt-2 text-base text-[#243D35]/70">
          {house.name} is yours to {house.status === "For Sale" ? "buy" : "rent"} until{" "}
          {when(reservation.endsAt)}.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 sm:p-8 print:rounded-none print:p-0">
        <div className="flex items-start justify-between gap-4 border-b border-[#243D35]/10 pb-5">
          <div>
            <h2 className="text-xl font-semibold">HueEstate</h2>
            <p className="text-sm text-[#243D35]/60">Payment receipt</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Paid
          </span>
        </div>

        <dl className="divide-y divide-[#243D35]/10">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-[#243D35]/60">{label}</dt>
              <dd className="min-w-0 break-words text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-2 flex items-center justify-between border-t border-[#243D35]/10 pt-5 text-lg font-semibold">
          <span>Total paid</span>
          <span>{etb(order.amount)}</span>
        </div>

        <p className="mt-4 text-xs text-[#243D35]/50">
          Reservation payments are non-refundable.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
        <PrintButton />
        <Link
          href="/dashboard"
          className="rounded-md border border-[#243D35]/20 px-6 py-3.5 text-center text-base font-medium transition hover:border-[#243D35]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function Message({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-base text-[#243D35]/70">{text}</p>
      <div className="mt-6 flex justify-center">{action}</div>
    </div>
  );
}