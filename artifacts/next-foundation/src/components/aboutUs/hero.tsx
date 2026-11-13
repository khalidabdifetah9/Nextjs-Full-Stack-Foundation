"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutUsHero() {
  const reduce = useReducedMotion();

  return (
    <section className="font-poppins">
      {/* Image opens up like a window, same as the home hero */}
      <motion.div
        className="relative h-[55vh] w-full overflow-hidden sm:h-[60vh] md:h-[68vh]"
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.3, ease }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
        >
          <Image
            fill
            priority
            sizes="100vw"
            src={"/Hue_Office.jpg"}
            alt="About Us Hero Background Image"
            className="object-cover"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-[#243D35]/50 via-transparent to-transparent"
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-5 text-xs uppercase tracking-wide text-white sm:text-sm"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease }}
        >
          <span className="md:text-xl">Since 2014</span>
        </motion.div>
      </motion.div>

      {/* Giant wordmark: same rise + blur-to-sharp as the home hero */}
      <div className="overflow-hidden bg-white px-4 md:px-12">
        <h1 className="select-none pt-4 text-left text-[19vw] font-semibold leading-[0.85] tracking-tighter text-[#243D35] md:-mt-7 md:pt-0 md:text-[18vw] lg:text-[15vw]">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 60, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.7, ease }}
          >
            About
          </motion.span>{" "}
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 60, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.85, ease }}
          >
            Us
          </motion.span>
        </h1>
      </div>
    </section>
  );
}