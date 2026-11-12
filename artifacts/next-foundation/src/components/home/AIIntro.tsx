"use client";

import { motion, useReducedMotion } from "framer-motion";

const cards = [
  {
    id: "color-harmony",
    title: "Smart Color Harmony",
    body: "Instantly discover complementary wall shades, material finishes, and accent tones that match your personal aesthetic.",
  },
  {
    id: "real-time",
    title: "Real Time Generation",
    body: "Test layout concepts and visualize automated design ideas before making a single change to your home.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function IntelligentStudio() {
  const reduce = useReducedMotion();

  // Fade + gentle rise, triggered once when scrolled into view
  const reveal = (delay = 0, y = 32) => ({
    initial: reduce ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="studio" className="mt-20 scroll-mt-30 md:mt-32 lg:mt-50  font-poppins">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-10 lg:justify-between lg:gap-16">
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:gap-8">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-wide text-[#243D35]/60"></p>
            <div className="space-y-4 md:space-y-6">
              <motion.h2
                {...reveal(0)}
                className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-[#243D35]"
              >
                Meet Your AI Design Assistant to Shape Every Space
              </motion.h2>
              <motion.p
                {...reveal(0.12, 24)}
                className="text-base sm:text-lg text-[#243D35]/80"
              >
                Let our advanced AI assistant analyze spatial layouts, suggest
                harmonious interior color palettes, and generate real-time
                design recommendations tailored specifically to your
                architectural vision.
              </motion.p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                {...reveal(i * 0.15, 40)}
                className="flex h-full flex-col rounded-3xl bg-[#F7F6F2] p-3"
              >
                <h3 className="rounded-2xl bg-white px-5 py-4 text-lg md:text-xl font-medium text-[#243D35]">
                  {card.title}
                </h3>
                <p className="px-3 pb-4 pt-8 md:pt-12 text-base text-[#243D35]/70">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video slides in from the right and settles */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="relative h-96 sm:h-128 lg:h-auto lg:min-h-150 overflow-hidden rounded-lg bg-[#243D35]"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/vid1.mp4"
            poster="/ai-assistant-poster.png"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="AI design assistant preview"
          />
        </motion.div>
      </div>
    </section>
  );
}