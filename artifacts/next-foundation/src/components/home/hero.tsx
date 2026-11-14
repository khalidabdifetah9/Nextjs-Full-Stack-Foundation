"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number, y = 24) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section>
      <div className="@container rounded-t-md pt-5 overflow-hidden">
        <div className="flex justify-between">
          <motion.p
            {...fadeUp(0.1)}
            className="w-full max-w-sm font-poppins text-base tracking-wider text-[#243D35] sm:max-w-md sm:text-xl md:w-99 md:max-w-none md:text-2xl"
          >
            Discover thoughtfully designed homes and make every space reflect
            your style, before you even move in
          </motion.p>

          <div className="hidden w-40 md:block" aria-hidden="true" />
        </div>

        {/* Tablet fix: md:mt-6 (stacked) -> lg:-mt-30 (desktop overlap restored) */}
        <h1 className="mt-8 select-none text-right text-[19cqw] font-semibold leading-[0.85] tracking-tighter text-[#243D35] sm:mt-10 md:mt-6 md:text-[18vw] lg:-mt-30 lg:text-[15vw]">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 60, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.25, ease }}
          >
            Hue
          </motion.span>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 60, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            Estate
          </motion.span>
        </h1>
      </div>

      {/* Image "opens up" like a window being revealed */}
      <motion.div
        className="relative h-[55vh] w-full overflow-hidden rounded-b-md sm:h-[65vh] md:h-[75vh]"
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.3, delay: 0.55, ease }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, delay: 0.55, ease }}
        >
          <Image
            fill
            priority
            sizes="100vw"
            src="/herro.avif"
            alt="women relaxing in her house"
            className="object-cover rounded-b-md"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}