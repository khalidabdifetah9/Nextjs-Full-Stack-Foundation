"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { palette } from "@/lib/colors";
import type { PaletteColor } from "@/lib/colors";
import { MAX_DAYS, PRICE_PER_DAY_ETB } from "@/lib/pricing";

/* ---------- the questions and answers: edit these ---------- */

interface Answer {
  text: string;
  color?: PaletteColor;
  link?: { href: string; label: string };
}

interface Topic {
  id: string;
  question: string;
  answer: () => Answer;
}

// A random color, never the same one twice in a row
let lastColor = "";
function randomColor() {
  const options = palette.filter((c) => c.id !== lastColor);
  const pick = options[Math.floor(Math.random() * options.length)];
  lastColor = pick.id;
  return pick;
}

const topics: Topic[] = [
  {
    id: "after-appointment",
    question: "What happens after I book an appointment?",
    answer: () => ({
      text:
        "Your appointment is saved and shows up in My Activity. Our team may call you before your day to remind you, so keep your phone number up to date in your profile. You can cancel an upcoming appointment from Make a Schedule.",
      link: { href: "/dashboard/schedule", label: "Open Make a Schedule" },
    }),
  },
  {
    id: "refund",
    question: "Can I get a refund on a reservation?",
    answer: () => ({
      text:
        "No. Reservation payments are non-refundable, even if you buy or rent the home before your reserved days are over. Please check the number of days before you pay.",
    }),
  },
  {
    id: "how-reserve",
    question: "How does reserving a home work?",
    answer: () => ({
      text: `Pick a home and press Buy Later or Rent Later. Choose how many days (up to ${MAX_DAYS}) and pay securely with Chapa. While your reservation is active, nobody else can reserve that home.`,
    }),
  },
  {
    id: "cost",
    question: "How much does a reservation cost?",
    answer: () => ({
      text: `Each day costs ETB ${PRICE_PER_DAY_ETB.toLocaleString("en-US")}. The total updates as you choose the number of days, and you can reserve a home for up to ${MAX_DAYS} days.`,
    }),
  },
  {
    id: "trending-color",
    question: "What's a trending color?",
    answer: () => {
      const color = randomColor();
      return {
        text: `Trending pick: ${color.name} (${color.hex}). Pick it from the color bar in the Preview Room to see it on the walls. Ask again for another one!`,
        color,
      };
    },
  },
  {
    id: "wall-color",
    question: "How do I change a room's wall color?",
    answer: () => ({
      text:
        "Open the Preview Room, then choose a swatch in the color bar above the viewer. Use the Strength slider to make the color softer or stronger. Some rooms don't support color changes yet.",
      link: { href: "/dashboard", label: "Open Preview Room" },
    }),
  },
  {
    id: "move-rooms",
    question: "How do I move between rooms?",
    answer: () => ({
      text:
        "Drag to look around. Tap the arrow circles inside the room to walk into the next room, or use the room buttons at the top left of the viewer.",
    }),
  },
  {
    id: "where-activity",
    question: "Where can I see my payments and bookings?",
    answer: () => ({
      text:
        "Everything you have reserved, paid for and booked is in My Activity, including a receipt for each payment.",
      link: { href: "/dashboard/activity", label: "Open My Activity" },
    }),
  },
  {
    id: "contact",
    question: "I need to talk to someone",
    answer: () => ({
      text: "No problem. Send us a message and we'll get back to you as soon as we can.",
      link: { href: "/contact-us", label: "Contact us" },
    }),
  },
];

/* ---------- the chat ---------- */

interface Message extends Partial<Answer> {
  id: number;
  from: "bot" | "user";
  text: string;
}

const greeting: Message = {
  id: 0,
  from: "bot",
  text: "Hi! I'm the HueEstate assistant. Pick a question below and I'll help.",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [typing, setTyping] = useState(false);

  const nextId = useRef(1);
  const timer = useRef<number | undefined>(undefined);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function ask(topic: Topic) {
    if (typing) return;
    setMessages((m) => [...m, { id: nextId.current++, from: "user", text: topic.question }]);
    setTyping(true);

    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "bot", ...topic.answer() }]);
      setTyping(false);
    }, 450);
  }

  function restart() {
    window.clearTimeout(timer.current);
    setTyping(false);
    setMessages([greeting]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className="fixed right-4 top-3 z-40 flex h-11 items-center gap-2 rounded-full bg-[#243D35] px-4 font-poppins text-sm font-medium text-white shadow-lg transition hover:bg-[#1a2d27] lg:right-8 lg:top-5 print:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
          )}
        </svg>
        <span className="hidden sm:inline">{open ? "Close" : "Need help?"}</span>
      </button>

      {open && (
        <div
          id="assistant-panel"
          role="dialog"
          aria-label="HueEstate assistant"
          className="fixed inset-x-4 top-16 z-50 flex max-h-[calc(100dvh-5rem)] flex-col overflow-hidden rounded-2xl border border-[#243D35]/10 bg-white font-poppins text-[#243D35] shadow-2xl sm:inset-x-auto sm:right-4 sm:w-96 lg:right-8 lg:top-20 print:hidden"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 bg-[#243D35] px-5 py-4 text-white">
            <div>
              <p className="font-semibold">HueEstate assistant</p>
              <p className="text-xs text-white/70">Quick answers, no waiting</p>
            </div>
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-white/30 px-3 py-1 text-xs transition hover:bg-white/10"
            >
              Start over
            </button>
          </div>

          <div ref={listRef} aria-live="polite" className="min-h-48 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-md bg-[#243D35] text-white"
                      : "rounded-bl-md bg-[#F7F6F2]"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.color && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-white p-2">
                      <span
                        className="h-9 w-9 shrink-0 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: m.color.hex }}
                      />
                      <div>
                        <p className="text-sm font-semibold">{m.color.name}</p>
                        <p className="font-mono text-xs text-[#243D35]/60">{m.color.hex}</p>
                      </div>
                    </div>
                  )}

                  {m.link && (
                    <Link
                      href={m.link.href}
                      onClick={() => setOpen(false)}
                      className="mt-3 inline-block font-medium underline underline-offset-4"
                    >
                      {m.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start" aria-label="Typing">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-[#F7F6F2] px-4 py-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#243D35]/40" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#243D35]/40 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#243D35]/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="max-h-44 shrink-0 overflow-y-auto border-t border-[#243D35]/10 p-3">
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => ask(t)}
                  disabled={typing}
                  className="rounded-full border border-[#243D35]/20 px-3 py-1.5 text-left text-xs transition hover:border-[#243D35] hover:bg-[#F7F6F2] disabled:opacity-50 sm:text-sm"
                >
                  {t.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}