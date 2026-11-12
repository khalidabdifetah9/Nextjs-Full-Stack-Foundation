"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type CustomizationProps = {
  videoSrc?: string;
  posterSrc?: string;
  ctaHref?: string;
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Customization({
  videoSrc = "/videos/house_preview.mp4",
  posterSrc,
  ctaHref = "/dashboard",
  className = "",
}: CustomizationProps) {
  const reduce = useReducedMotion();

  // Fade + gentle rise, triggered once when scrolled into view
  const reveal = (delay = 0, y = 32) => ({
    initial: reduce ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      id="customize"
      aria-labelledby="customization-heading"
      className={`mt-20 font-poppins md:mt-32 lg:mt-50 ${className}`}
    >
      {/* Header */}
      <header className="mx-auto mb-10 max-w-300 space-y-4 text-center md:mb-20 md:space-y-6">
        <motion.h2
          {...reveal(0)}
          id="customization-heading"
          className="text-3xl font-bold leading-tight text-[#243D35] sm:text-4xl lg:text-[4vw]"
        >
          Customize Your Space
        </motion.h2>
        <motion.p
          {...reveal(0.12, 24)}
          className="text-base text-[#243D35]/80 sm:text-xl md:text-2xl"
        >
          Choose a home, try a new wall color, and watch it change in real time
          before you make any decision.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: two stacked cards */}
        <div className="flex flex-col gap-4">
          {/* Top card (dark) */}
          <motion.div
            {...reveal(0)}
            className="flex min-h-56 flex-col justify-between gap-8 rounded-md bg-[#243D35] p-6 text-white sm:min-h-64 sm:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <p className="max-w-sm text-2xl font-medium leading-tight sm:text-3xl">
                See your house in any color before you decide
              </p>
              <span className="hidden shrink-0 font-mono text-xs uppercase tracking-wide text-white/60 sm:block">
                Color options
              </span>
            </div>

            <p className="max-w-md text-base text-white/70">
              Choose a house, pick a color for the walls, and see how it looks
              right away.
            </p>
          </motion.div>

          {/* Bottom card (light) */}
          <motion.div
            {...reveal(0.15)}
            className="flex min-h-56 flex-1 flex-col justify-between gap-8 rounded-md bg-[#F7F6F2] p-6 sm:min-h-64 sm:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="max-w-xs text-2xl font-medium leading-tight text-[#243D35] sm:text-3xl">
                Pick a house and make it yours
              </h3>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">
                  Live preview
                </p>
                <p className="mt-3 text-base font-medium leading-snug text-[#243D35]">
                  Every color change
                  <br />
                  shows in real time
                </p>
              </div>
            </div>

            <div>
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-md bg-[#243D35] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-[#1a2d27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#243D35]"
              >
                View Properties
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right: video reveals with a soft clip + settle */}
        <motion.div
          initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-[#F7F6F2]"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Screen recording of choosing a house and changing its colors live"
          />
        </motion.div>
      </div>
    </section>
  );
}