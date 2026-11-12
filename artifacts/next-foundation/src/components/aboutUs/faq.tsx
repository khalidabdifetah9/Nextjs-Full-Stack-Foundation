"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    id: "canvas",
    question: "What is a white canvas residence?",
    answer:
      "A finished, move in ready structure with neutral walls and floors, built so you can personalize every room without tearing anything out.",
  },
  {
    id: "palettes",
    question: "How do real time room palettes work?",
    answer:
      "Pick a room, choose a palette, and see wall shades, finishes, and accents update instantly before you commit to a single change.",
  },
  {
    id: "cost",
    question: "Is the AI design assistant free to use?",
    answer:
      "Yes. Creating an account and testing palettes is free. You only pay when you decide to move forward with a property.",
  },
  {
    id: "support",
    question: "Can I speak to a designer before deciding?",
    answer:
      "Absolutely. Book a free consultation and a designer will walk you through layouts, materials, and next steps.",
  },
];

export default function Faq() {
  const reduce = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offsets, setOffsets] = useState<{ x: number; y: number }[] | null>(
    null
  );
  const inView = useInView(gridRef, { once: true, amount: 0.2 });

  // Measure how far each card must travel to sit on top of the first card
  useEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      if (!first) return;
      const isMd = window.matchMedia("(min-width: 768px)").matches;
      setOffsets(
        cardRefs.current.map((el, i) => {
          if (!el) return { x: 0, y: 0 };
          // Odd cards are shifted down 48px (md:translate-y-12) on md+
          const lift = isMd && i % 2 === 1 ? 48 : 0;
          return {
            x: first.offsetLeft - el.offsetLeft,
            y: first.offsetTop - (el.offsetTop + lift),
          };
        })
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const reveal = (delay = 0, y = 24) => ({
    initial: reduce ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease },
  });

  const total = faqs.length;
  const spread = reduce || (inView && offsets);

  return (
    <section id="faq" className="my-20 md:my-22 lg:my-30 font-poppins">
      <header className="mb-10 max-w-2xl space-y-4 md:mb-16 md:space-y-6">
        <motion.h2
          {...reveal(0)}
          className="text-3xl font-semibold leading-tight text-[#243D35] sm:text-4xl lg:text-5xl"
        >
          Questions, answered
        </motion.h2>
        <motion.p
          {...reveal(0.12)}
          className="text-base text-[#243D35]/80 sm:text-lg md:text-xl"
        >
          Everything you need to know before shaping your space.
        </motion.p>
      </header>

      <div
        ref={gridRef}
        className="grid gap-5 md:grid-cols-2 md:gap-7 md:pb-12"
      >
        {faqs.map((faq, index) => {
          const off = offsets?.[index] ?? { x: 0, y: 0 };

          return (
            // The wrapper does the spread, so the card's own hover styles and
            // its md:translate-y-12 stagger are left untouched
            <motion.div
              key={faq.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{ zIndex: total - index }} // first card on top of the pile
              initial={false}
              animate={
                spread
                  ? { x: 0, y: 0, scale: 1, opacity: 1 }
                  : { x: off.x, y: off.y, scale: 0.96, opacity: 0 }
              }
              transition={
                spread
                  ? {
                      duration: 0.9,
                      delay: reduce ? 0 : 0.15 + index * 0.12,
                      ease,
                    }
                  : { duration: 0 }
              }
              className="relative"
            >
              <article
                tabIndex={0}
                className={`group flex flex-col justify-between gap-10 border border-[#243D35]/20 bg-[#F7F6F2] p-6 text-[#243D35] outline-none transition-colors duration-500 hover:bg-[#243D35] hover:text-[#F7F6F2] focus-visible:bg-[#243D35] focus-visible:text-[#F7F6F2] md:h-80 md:p-8 ${
                  index % 2 === 1 ? "md:translate-y-12" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm opacity-60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="transition-transform duration-500 md:group-hover:rotate-45 md:group-focus-visible:rotate-45"
                  >
                    <path d="M10 3v14M3 10h14" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xl font-medium leading-snug sm:text-2xl">
                    {faq.question}
                  </h3>
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                    <div className="min-h-0 overflow-hidden">
                      <p className="pt-4 text-base opacity-80 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-80 md:group-focus-visible:opacity-80">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}