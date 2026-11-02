import Image from "next/image";
import type { CSSProperties } from "react";
import { howItWorksSection } from "@/lib/howItWorks";

export default function HowItWorks() {
  return (
    <section className="mt-20 md:mt-32 lg:mt-50">
      <header className="space-y-4 md:space-y-6 max-w-300 mx-auto text-center mb-10 md:mb-20">
        <h2 className="font-bold leading-tight text-3xl sm:text-4xl lg:text-[4vw] text-[#243D35]">
          Designing Your Dream Space is Simple
        </h2>
        <p className="text-base font-poppins sm:text-xl md:text-2xl text-[#243D35]/80">
          Discover white canvas homes, experiment with real time room palettes,
          and finalize your space with complete confidence.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative h-80 sm:h-112 lg:h-auto lg:min-h-150 overflow-hidden">
          <Image
            src="/relaxing.jpg"
            alt="White canvas home interior"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="font-poppins flex flex-col gap-5 md:gap-6">
          {howItWorksSection.steps.map((steps) => (
            <div
              key={steps.id}
              style={{ "--ml": steps.ml } as CSSProperties}
              className="bg-[#243D35] p-5 w-full max-w-100 text-white rounded-md md:ml-(--ml)"
            >
              <h3 className="text-xl font-bold py-7">
                {steps.badge}, {steps.title}
              </h3>
              <p className="text-lg">{steps.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
