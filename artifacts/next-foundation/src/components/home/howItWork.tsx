"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { howItWorksSection } from "@/lib/howItWorks";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HowItWorks() {
  const reduce = useReducedMotion();

  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offsets, setOffsets] = useState<{ x: number; y: number }[] | null>(
    null
  );
  const inView = useInView(listRef, { once: true, amount: 0.25 });

  // Measure how far each card must sit from the first card to form the stack
  useEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      if (!first) return;
      setOffsets(
        cardRefs.current.map((el) =>
          el
            ? {
                x: first.offsetLeft - el.offsetLeft,
                y: first.offsetTop - el.offsetTop,
              }
            : { x: 0, y: 0 }
        )
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const reveal = (delay = 0, y = 32) => ({
    initial: reduce ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease },
  });

  const total = howItWorksSection.steps.length;

  return (
    <section id="how-it-works" className="mt-20 scroll-mt-24 md:mt-32 lg:mt-50">
      <header className="space-y-4 md:space-y-6 max-w-300 mx-auto text-center mb-10 md:mb-20">
        <motion.h2
          {...reveal(0)}
          className="font-bold leading-tight text-3xl sm:text-4xl lg:text-[4vw] text-[#243D35]"
        >
          Designing Your Dream Space is Simple
        </motion.h2>
        <motion.p
          {...reveal(0.12, 24)}
          className="text-base font-poppins sm:text-xl md:text-2xl text-[#243D35]/80"
        >
          Discover white canvas homes, experiment with real time room palettes,
          and finalize your space with complete confidence.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease }}
          className="relative h-80 sm:h-112 lg:h-auto lg:min-h-150 overflow-hidden"
        >
          <Image
            src="/relaxing.jpg"
            alt="White canvas home interior"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <div
          ref={listRef}
          className="font-poppins flex flex-col gap-5 md:gap-6"
        >
          {howItWorksSection.steps.map((steps, i) => {
            const off = offsets?.[i] ?? { x: 0, y: 0 };
            const spread = reduce || (inView && offsets);

            return (
              <motion.div
                key={steps.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={
                  {
                    "--ml": steps.ml,
                    zIndex: total - i, // first card sits on top of the stack
                  } as CSSProperties
                }
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
                        delay: reduce ? 0 : 0.15 + i * 0.12,
                        ease,
                      }
                    : { duration: 0 }
                }
                className="relative bg-[#243D35] p-5 w-full max-w-100 text-white rounded-md md:ml-(--ml)"
              >
                <h3 className="text-xl font-bold py-7">
                  {steps.badge}, {steps.title}
                </h3>
                <p className="text-lg">{steps.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}