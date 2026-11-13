"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reserveHouse } from "@/actions/reserve";
import { checkPayment } from "@/actions/check-payment";
import {
  MAX_DAYS,
  MIN_DAYS,
  PRICE_PER_DAY_ETB as PRICE_PER_DAY,
} from "@/lib/pricing";

interface PaymentProps {
  status: string;
  houseId: string;
  houseName?: string;
}

const etb = (amount: number) => `ETB ${amount.toLocaleString("en-US")}`;

export default function Payment({ status, houseId, houseName }: PaymentProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(MIN_DAYS);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set once the Chapa tab is open: the pop-up switches to the "waiting" view
  const [waitingRef, setWaitingRef] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const isSale = status === "For Sale";
  const action = isSale ? "Buy" : "Rent";
  const total = days * PRICE_PER_DAY;

  // Stop the page behind the pop-up from scrolling
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // While waiting, ask the server every 4 seconds if the payment went through
  useEffect(() => {
    if (!waitingRef || !open) return;
    let stopped = false;

    const id = setInterval(async () => {
      let result: "SUCCESS" | "PENDING" | "FAILED" = "PENDING";
      try {
        result = await checkPayment(waitingRef);
      } catch {
        return; // ignore this round, try again in 4 seconds
      }
      if (stopped) return;

      if (result === "SUCCESS") {
        router.push(`/dashboard/payment?ref=${waitingRef}`);
      } else if (result === "FAILED") {
        setWaitingRef(null);
        setError("The payment was not completed. You can try again.");
      }
    }, 4000);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [waitingRef, open, router]);

  function openModal() {
    setDays(MIN_DAYS);
    setAgreed(false);
    setLoading(false);
    setError("");
    setWaitingRef(null);
    setOpen(true);
  }

  function changeDays(next: number) {
    if (Number.isNaN(next)) return;
    setDays(Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(next))));
  }

  async function proceed() {
    if (!agreed || loading) return;
    setLoading(true);
    setError("");

    // Open the tab right now, inside the click, so popup blockers allow it
    const tab = window.open("about:blank", "_blank");

    const result = await reserveHouse(houseId, days);

    if ("error" in result) {
      tab?.close();
      setError(result.error);
      setLoading(false);
      return;
    }

    if (tab) {
      tab.location.href = result.checkoutUrl; // Chapa opens in the new tab
      setCheckoutUrl(result.checkoutUrl);
      setWaitingRef(result.reference); // this tab switches to the waiting view
      setLoading(false);
    } else {
      // Popup was blocked: fall back to the same tab
      window.location.assign(result.checkoutUrl);
    }
  }

  // Shown only once the pop-up is open, so the date can't mismatch on hydration
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
            // a click on the dimmed backdrop targets the dialog itself
            if (e.target === e.currentTarget && !loading) setOpen(false);
          }}
          aria-labelledby="reserve-title"
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-md bg-white p-0 font-poppins text-[#243D35] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
          <div className="p-6 sm:p-8">
            {waitingRef ? (
              /* ---------- VIEW 2: waiting for the payment in the other tab ---------- */
              <div className="py-4 text-center">
                <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-[#243D35]/20 border-t-[#243D35]" />
                <h2 id="reserve-title" className="mt-6 text-2xl font-semibold">
                  Complete your payment
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#243D35]/70">
                  Chapa opened in a new tab. Finish paying there, and this page
                  will update by itself as soon as the payment is confirmed.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-[#243D35]/20 px-6 py-3.5 text-base font-medium transition hover:border-[#243D35]"
                  >
                    Reopen payment tab
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/payment?ref=${waitingRef}`)
                    }
                    className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white transition hover:bg-[#1a2d27]"
                  >
                    I&apos;ve paid, check now
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-sm text-[#243D35]/60 underline underline-offset-4"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* ---------- VIEW 1: choose days and pay ---------- */
              <>
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
                      <p className="mt-1 text-sm text-[#243D35]/70">
                        {houseName}
                      </p>
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
                  {isSale ? "buy" : "rent"} it while you decide. Reservation
                  costs {etb(PRICE_PER_DAY)} per day.
                </p>

                {/* Days picker */}
                <div className="mt-6">
                  <label
                    htmlFor="days"
                    className="mb-2 block text-sm font-medium"
                  >
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

                {/* Price summary */}
                <dl className="mt-6 space-y-3 rounded-md bg-[#F7F6F2] p-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#243D35]/70">
                      {etb(PRICE_PER_DAY)} × {days}{" "}
                      {days === 1 ? "day" : "days"}
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

                {/* No refund notice */}
                <div className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                  <p className="font-semibold">No refunds</p>
                  <p className="mt-1">
                    Once payment is completed it can&apos;t be refunded, even if
                    you
                    {isSale ? " buy" : " rent"} the home before your reserved
                    days are over.
                  </p>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#243D35]"
                  />
                  I understand that this payment is non-refundable.
                </label>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

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
              </>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
