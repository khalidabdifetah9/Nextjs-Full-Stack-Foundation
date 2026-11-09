"use client";

import { useState } from "react";
import { houses } from "@/lib/houses";
import { bookedSlots, formatTime, fromKey } from "@/lib/schedule";
import Calendar from "./Calendar";
import TimeSlots from "./TimeSlots";

interface Appointment {
  id: string;
  date: string;
  time: string;
  topic: string;
  note: string;
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

export default function ScheduleBooking() {
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [topic, setTopic] = useState("General consultation");
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState<Record<string, string[]>>(bookedSlots);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  function pickDate(key: string) {
    setDate(key);
    setTime(null);
  }

  function confirm() {
    if (!date || !time) return;

    const appointment: Appointment = {
      id: `${date}-${time}`,
      date,
      time,
      topic,
      note,
    };

    console.log("New appointment:", appointment);

    setBooked((prev) => ({ ...prev, [date]: [...(prev[date] ?? []), time] }));
    setAppointments((prev) => [...prev, appointment]);
    setDate(null);
    setTime(null);
    setNote("");
  }

  function cancel(appointment: Appointment) {
    setAppointments((prev) => prev.filter((a) => a.id !== appointment.id));
    setBooked((prev) => ({
      ...prev,
      [appointment.date]: (prev[appointment.date] ?? []).filter(
        (t) => t !== appointment.time
      ),
    }));
  }

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

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Left: calendar */}
        <Calendar selected={date} onSelect={pickDate} />

        {/* Right: time + details */}
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-4 sm:p-6">
            <h2 className="text-xl font-semibold">
              {date ? prettyDate(date) : "Select a date"}
            </h2>

            {date ? (
              <div className="mt-5 space-y-6">
                <TimeSlots taken={booked[date] ?? []} selected={time} onSelect={setTime} />

                <div>
                  <label htmlFor="topic" className="mb-2 block text-sm font-medium">
                    What is this for?
                  </label>
                  <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={fieldClass}
                  >
                    <option>General consultation</option>
                    {houses.map((h) => (
                      <option key={h.id}>Viewing: {h.name}</option>
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
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anything we should know?"
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <button
                  type="button"
                  onClick={confirm}
                  disabled={!time}
                  className="w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {time
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

          {/* Booked by the user */}
          {appointments.length > 0 && (
            <section className="rounded-2xl bg-white p-4 sm:p-6">
              <h2 className="text-xl font-semibold">Your appointments</h2>
              <ul className="mt-4 divide-y divide-[#243D35]/10">
                {appointments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {prettyDate(a.date)} · {formatTime(a.time)}
                      </p>
                      <p className="truncate text-sm text-[#243D35]/60">{a.topic}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cancel(a)}
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