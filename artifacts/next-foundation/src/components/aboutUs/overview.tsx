"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { id: "years", value: "10+", label: "Years of experience" },
  { id: "homes", value: "250+", label: "Spaces designed" },
  { id: "clients", value: "98%", label: "Client satisfaction" },
];

export default function OverView() {
  const reduce = useReducedMotion();

  // Fade + gentle rise, triggered once when scrolled into view
  const reveal = (delay = 0, y = 24) => ({
    initial: reduce ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section className="bg-white font-poppins pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="relative grid gap-10 pt-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:pt-14">
        {/* Top border draws itself from left to right */}
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-x-0 top-0 h-px origin-left bg-[#243D35]/15"
        />

        <div className="space-y-5">
          <motion.p
            {...reveal(0)}
            className="max-w-xl text-xl font-medium leading-snug text-[#243D35] sm:text-2xl md:text-3xl"
          >
            We blend architecture and intelligent design to help you shape
            spaces that feel unmistakably yours.
          </motion.p>
          <motion.p
            {...reveal(0.12)}
            className="max-w-xl text-base text-[#243D35]/70 md:text-lg"
          >
            Founded in 2014, HueEstate began with a simple observation static
            blueprints fail to capture the true atmosphere of a home. What
            started as a boutique architectural studio has evolved into a
            digital visualizer platform engineered to bridge high end interior
            craftsmanship with real time room previewing.
          </motion.p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-[#243D35]/15 self-end">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              {...reveal(0.2 + i * 0.12)}
              className="px-3 first:pl-0 sm:px-6 md:px-8"
            >
              <dd className="text-3xl font-semibold tracking-tight text-[#243D35] sm:text-5xl lg:text-6xl">
                {s.value}
              </dd>
              <dt className="mt-2 text-xs text-[#243D35]/70 sm:text-sm md:text-base">
                {s.label}
              </dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}