// Days that are fully booked. Format: YYYY-MM-DD
export const busyDates: string[] = [
  "2026-11-12",
  "2026-11-13",
  "2026-11-18",
  "2026-11-24",
  "2026-12-02",
];

// Times already taken on a specific day
export const bookedSlots: Record<string, string[]> = {
  "2026-11-10": ["09:00", "10:00", "14:00"],
  "2026-11-11": ["11:00"],
  "2026-11-16": ["09:00", "10:00", "11:00", "13:00"],
};

export const timeSlots = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
];

// 0 = Sunday ... 6 = Saturday. We are closed on Sundays.
export const closedWeekdays = [0];

export type DayStatus = "available" | "busy" | "past" | "closed";

// Turn a Date into "YYYY-MM-DD" (using the local date, not UTC)
export function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Turn "YYYY-MM-DD" back into a Date
export function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "13:00" -> "1:00 PM"
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Decides whether a day can be picked
export function getDayStatus(date: Date): DayStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) return "past";
  if (closedWeekdays.includes(date.getDay())) return "closed";
  if (busyDates.includes(toKey(date))) return "busy";
  return "available";
}