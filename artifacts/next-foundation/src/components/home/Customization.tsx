import React from "react";

type CustomizationProps = {
  videoSrc?: string;
  posterSrc?: string;
  ctaHref?: string;
  className?: string;
};

const Customization: React.FC<CustomizationProps> = ({
  videoSrc = "/videos/house_preview.mp4",
  posterSrc,
  ctaHref = "/dashboard",
  className = "",
}) => {
  return (
    <section
      className={`w-full max-w-[1400px] font-poppins py-10 px-3 ${className}`}
      aria-labelledby="customization-heading"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT COLUMN: two stacked text cards */}
        <div className="flex flex-col gap-3">
          {/* Top card (dark) */}
          <div className="flex min-h-[340px] flex-col justify-between rounded-2xl bg-[#1a1a1a] p-8 text-white sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <p className="max-w-sm text-3xl font-medium leading-tight sm:text-4xl">
                See your house in any color before you decide
              </p>
              <span className="hidden shrink-0 text-sm font-semibold sm:block">
                (Color options)
              </span>
            </div>

            <p className="mt-8 max-w-md text-base text-white/60">
              Choose a house, pick a color for the walls, roof, or door, and
              see how it looks right away.
            </p>
          </div>

          <div className="flex min-h-[368px] flex-1 flex-col justify-between rounded-2xl bg-gradient-to-b from-[#f5f6f7] to-[#e4e4e6] p-8 sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <h2
                id="customization-heading"
                className="max-w-xs text-2xl font-medium leading-tight text-neutral-900 sm:text-[28px]"
              >
                Pick a house and make it yours
              </h2>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-sm font-semibold text-neutral-900">
                  (Live preview)
                </p>
                <p className="mt-3 text-base font-medium leading-snug text-neutral-900">
                  Every color change
                  <br />
                  shows in real time
                </p>
              </div>
            </div>

            <div className="mt-10">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-full bg-black px-7 py-4 text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                View Properties
              </a>
            </div>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden bg-white rounded-2xl lg:min-h-full">
          <video
            className="absolute inset-0 h-full w-full object-contain"
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Screen recording of choosing a house and changing its colors live"
          />
        </div>
      </div>
    </section>
  );
};

export default Customization;