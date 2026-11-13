"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookAppointment, cancelAppointment } from "@/actions/schedule";
import { MAX_UPCOMING, formatTime, fromKey, isSlotPast, timeSlots } from "@/lib/schedule";
import Calendar from "./Calendar";
import TimeSlots from "./TimeSlots";

export interface MyAppointment {
  id: string;
  date: string;
  time: string;
  topic: string;
}

interface ScheduleBookingProps {
  booked: Record<string, string[]>;
  mine: MyAppointment[];
  homes: { id: string; name: string }[];
}

const fieldClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3 text-base outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15";

function prettyDate(key: string) {
  return fromKey(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function ScheduleBooking({ booked, mine, homes }: ScheduleBookingProps) {
  const router = useRouter();

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [houseId, setHouseId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const limitReached = mine.length >= MAX_UPCOMING;

  function pickDate(key: string) {
    setDate(key);
    setTime(null); // a new day needs a new time
    setError("");
    setSuccess("");
  }

  async function confirm() {
    if (!date || !time || saving) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const result = await bookAppointment({ date, time, houseId: houseId || null, note });
    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      router.refresh(); // reload availability in case the time was just taken
      return;
    }

    setSuccess(`Booked for ${prettyDate(date)} at ${formatTime(time)}.`);
    setDate(null);
    setTime(null);
    setNote("");
    setHouseId("");
  }

  async function cancel(id: string) {
    setError("");
    setSuccess("");
    const result = await cancelAppointment(id);
    if ("error" in result) setError(result.error);
  }

  // Times taken by others, plus times that already passed today
  const unavailable = date
    ? [...(booked[date] ?? []), ...timeSlots.filter((t) => isSlotPast(date, t))]
    : [];

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">
          Make a Schedule
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Book your appointment
        </h1>
        <p className="text-base text-[#243D35]/70">
          Pick an available day and time. Booked days can&apos;t be selected.
        </p>
      </header>

      {success && (
        <p role="status" className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Calendar selected={date} booked={booked} onSelect={pickDate} />

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-4 sm:p-6">
            <h2 className="text-xl font-semibold">
              {date ? prettyDate(date) : "Select a date"}
            </h2>

            {date ? (
              <div className="mt-5 space-y-6">
                <TimeSlots taken={unavailable} selected={time} onSelect={setTime} />

                <div>
                  <label htmlFor="topic" className="mb-2 block text-sm font-medium">
                    What is this for?
                  </label>
                  <select
                    id="topic"
                    value={houseId}
                    onChange={(e) => setHouseId(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">General consultation</option>
                    {homes.map((h) => (
                      <option key={h.id} value={h.id}>
                        Viewing: {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="note" className="mb-2 block text-sm font-medium">
                    Note <span className="text-[#243D35]/50">(optional)</span>
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    maxLength={500}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anything we should know?"
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                {limitReached && (
                  <p className="text-sm text-amber-700">
                    You already have {MAX_UPCOMING} upcoming appointments. Cancel one to book another.
                  </p>
                )}

                <button
                  type="button"
                  onClick={confirm}
                  disabled={!time || saving || limitReached}
                  className="w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Booking..."
                    : time
                      ? `Confirm ${formatTime(time)}`
                      : "Choose a time to continue"}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#243D35]/60">
                Choose a day on the calendar to see the available times.
              </p>
            )}
          </section>

          {mine.length > 0 && (
            <section className="rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-xl font-semibold">Your upcoming appointments</h2>
              <ul className="mt-4 divide-y divide-[#243D35]/10">
                {mine.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {prettyDate(a.date)} · {formatTime(a.time)}
                      </p>
                      <p className="truncate text-sm text-[#243D35]/60">{a.topic}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cancel(a.id)}
                      className="shrink-0 text-sm text-red-600 underline underline-offset-4"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}