export const BUSINESS_TZ = "Africa/Addis_Ababa";

export const timeSlots = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
];

// 0 = Sunday ... 6 = Saturday. We are closed on Sundays.
export const closedWeekdays = [0];

// Extra days off such as holidays, as "YYYY-MM-DD"
export const blockedDates: string[] = [];

// How many upcoming appointments one user can hold at the same time
export const MAX_UPCOMING = 3;

export type DayStatus = "available" | "busy" | "past" | "closed";

// Date -> "YYYY-MM-DD" using the local date (not UTC)
export function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

// The current date and time in the business time zone
export function businessNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function isSlotPast(dateKey: string, time: string) {
  const now = businessNow();
  return dateKey < now.date || (dateKey === now.date && time <= now.time);
}

export function isClosedDay(dateKey: string) {
  return closedWeekdays.includes(fromKey(dateKey).getDay()) || blockedDates.includes(dateKey);
}

// Decides whether a day can be picked
export function getDayStatus(date: Date, booked: Record<string, string[]>): DayStatus {
  const key = toKey(date);

  if (key < businessNow().date) return "past";
  if (timeSlots.every((t) => isSlotPast(key, t))) return "past"; // today, all times gone
  if (isClosedDay(key)) return "closed";

  const taken = booked[key] ?? [];
  const free = timeSlots.filter((t) => !isSlotPast(key, t) && !taken.includes(t));
  return free.length > 0 ? "available" : "busy";
}