"use client";

import { useState } from "react";
import { getDayStatus, toKey } from "@/lib/schedule";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarProps {
  selected: string | null;
  onSelect: (dateKey: string) => void;
}

export default function Calendar({ selected, onSelect }: CalendarProps) {
  const today = new Date();
  const [view, setView] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay(); // empty cells before day 1
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const monthLabel = view.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function changeMonth(step: number) {
    setView(new Date(year, month + step, 1));
  }

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{monthLabel}</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            disabled={isCurrentMonth}
            aria-label="Previous month"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F6F2] transition hover:bg-[#243D35] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#F7F6F2] disabled:hover:text-inherit"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F6F2] transition hover:bg-[#243D35] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday names */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium uppercase tracking-wide text-[#243D35]/50">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-2">{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1);
          const key = toKey(date);
          const status = getDayStatus(date);
          const isSelected = selected === key;
          const isToday = key === toKey(today);

          let style = "";
          if (isSelected) {
            style = "bg-[#243D35] text-white";
          } else if (status === "available") {
            style = "text-[#243D35] hover:bg-[#F7F6F2]";
          } else if (status === "busy") {
            style = "cursor-not-allowed bg-red-50 text-red-400 line-through";
          } else {
            style = "cursor-not-allowed text-[#243D35]/25";
          }

          return (
            <button
              key={key}
              type="button"
              disabled={status !== "available"}
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={`${date.toDateString()}${status === "busy" ? ", fully booked" : ""}`}
              className={`relative aspect-square rounded-xl text-sm font-medium transition-colors sm:text-base ${style}`}
            >
              {i + 1}
              {isToday && !isSelected && (
                <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#243D35]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#243D35]/10 pt-4 text-xs text-[#243D35]/70">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-[#243D35]" /> Selected
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-red-100" /> Fully booked
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-[#243D35]/10" /> Closed / past
        </li>
      </ul>
    </div>
  );
}