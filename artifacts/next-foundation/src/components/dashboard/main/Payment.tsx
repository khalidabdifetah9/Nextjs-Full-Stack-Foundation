"use client";
import { reserveHouse } from "@/actions/reserve";
import {
  MAX_DAYS,
  MIN_DAYS,
  PRICE_PER_DAY_ETB as PRICE_PER_DAY,
} from "@/lib/pricing";
import { useEffect, useState } from "react";

interface PaymentProps {
  status: string;
  houseId: string;
  houseName?: string;
}

const etb = (amount: number) => `ETB ${amount.toLocaleString("en-US")}`;

export default function Payment({ status, houseName, houseId }: PaymentProps) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(MIN_DAYS);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSale = status === "For Sale";
  const action = isSale ? "Buy" : "Rent";
  const total = days * PRICE_PER_DAY;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function openModal() {
    setDays(MIN_DAYS);
    setAgreed(false);
    setLoading(false);
    setOpen(true);
    setError("");
  }

  function changeDays(next: number) {
    if (Number.isNaN(next)) return;
    setDays(Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(next))));
  }

  async function proceed() {
    if (!agreed || loading) return;
    setLoading(true);
    setError("");

    const result = await reserveHouse(houseId, days);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }
    window.location.assign(result.checkoutUrl);
  }

  const reservedUntil = open
    ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        {
          weekday: "short",
          month: "long",
          day: "numeric",
        },
      )
    : "";

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="px-14 my-5 text-lg bg-black text-white cursor-pointer py-3.5 rounded-md"
      >
        {action} Later
      </button>

      {open && (
        <dialog
          ref={(el) => {
            if (el && !el.open) el.showModal();
          }}
          onClose={() => setOpen(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) setOpen(false);
          }}
          aria-labelledby="reserve-title"
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-md bg-white p-0 font-poppins text-[#243D35] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">
                  Reservation
                </p>
                <h2
                  id="reserve-title"
                  className="mt-2 text-2xl font-semibold leading-tight"
                >
                  {action} Later
                </h2>
                {houseName && (
                  <p className="mt-1 text-sm text-[#243D35]/70">{houseName}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F6F2] transition hover:bg-[#243D35] hover:text-white disabled:opacity-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#243D35]/70">
              Hold this home for up to {MAX_DAYS} days so nobody else can{" "}
              {isSale ? "buy" : "rent"} it while you decide. Reservation costs{" "}
              {etb(PRICE_PER_DAY)} per day.
            </p>

            <div className="mt-6">
              <label htmlFor="days" className="mb-2 block text-sm font-medium">
                Number of days
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeDays(days - 1)}
                  disabled={days <= MIN_DAYS}
                  aria-label="Decrease days"
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-[#243D35]/20 text-xl transition hover:border-[#243D35] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <input
                  id="days"
                  type="number"
                  inputMode="numeric"
                  min={MIN_DAYS}
                  max={MAX_DAYS}
                  value={days}
                  onChange={(e) => changeDays(Number(e.target.value))}
                  className="h-12 w-full min-w-0 rounded-md border border-[#243D35]/20 text-center text-lg font-medium outline-none transition [appearance:textfield] focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => changeDays(days + 1)}
                  disabled={days >= MAX_DAYS}
                  aria-label="Increase days"
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-[#243D35]/20 text-xl transition hover:border-[#243D35] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-xs text-[#243D35]/50">
                Between {MIN_DAYS} and {MAX_DAYS} days.
              </p>
            </div>

            <dl className="mt-6 space-y-3 rounded-md bg-[#F7F6F2] p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#243D35]/70">
                  {etb(PRICE_PER_DAY)} × {days} {days === 1 ? "day" : "days"}
                </dt>
                <dd>{etb(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#243D35]/70">Held until</dt>
                <dd>{reservedUntil}</dd>
              </div>
              <div className="flex justify-between border-t border-[#243D35]/10 pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{etb(total)}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              <p className="font-semibold">No refunds</p>
              <p className="mt-1">
                Once payment is completed it can&apos;t be refunded, even if you
                {isSale ? " buy" : " rent"} the home before your reserved days
                are over.
              </p>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#243D35]"
              />
              I understand that this payment is non refundable.
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-md border border-[#243D35]/20 px-6 py-3.5 text-base font-medium transition hover:border-[#243D35] disabled:opacity-50 sm:w-1/3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceed}
                disabled={!agreed || loading}
                className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
              >
                {loading ? "Processing..." : `Proceed to Pay ${etb(total)}`}
              </button>
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="my-4 text-center rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </dialog>
      )}
    </>
  );
}
