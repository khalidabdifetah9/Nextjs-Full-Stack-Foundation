import Link from "next/link";

const avatars = [
  { id: "a", initials: "AM", bg: "bg-[#F7F6F2]" },
  { id: "b", initials: "JK", bg: "bg-[#DCD9CE]" },
  { id: "c", initials: "SL", bg: "bg-[#C4C1B5]" },
];

const corners = [
  "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl [mask-image:linear-gradient(135deg,black_35%,transparent_85%)]",
  "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl [mask-image:linear-gradient(225deg,black_35%,transparent_85%)]",
  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl [mask-image:linear-gradient(45deg,black_35%,transparent_85%)]",
  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl [mask-image:linear-gradient(315deg,black_35%,transparent_85%)]",
];

export default function CallToAction() {
  return (
    <section className="mt-20 md:mt-32 lg:mt-50 font-poppins">
      <div className="bg-[#243D35] px-4 py-10 sm:px-8 md:py-24">
        <div className="relative mx-auto max-w-5xl px-6 py-14 sm:px-12 md:px-20 md:py-24">
          {corners.map((corner) => (
            <span
              key={corner}
              aria-hidden="true"
              className={`pointer-events-none absolute h-16 w-16 border-[#F7F6F2]/60 md:h-28 md:w-28 ${corner}`}
            />
          ))}

          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 rounded-lg border border-[#F7F6F2]/30 py-1.5 pl-2 pr-4">
              <div className="flex -space-x-2">
                {avatars.map((a) => (
                  <span
                    key={a.id}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#243D35] text-[10px] font-medium text-[#243D35] ${a.bg}`}
                  >
                    {a.initials}
                  </span>
                ))}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#243D35] bg-[#F7F6F2] text-[9px] font-semibold text-[#243D35]">
                  1k+
                </span>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-[#F7F6F2] sm:text-sm">
                Trusted Homeowners
              </span>
            </div>

            <h2 className="mt-8 max-w-4xl text-3xl font-semibold leading-tight text-[#F7F6F2] sm:text-5xl lg:text-6xl md:mt-12">
              Ready to <span className="text-[#F7F6F2]/45">find your space?</span>{" "}
              Get your <br className="hidden md:block" />
              Custom <span className="text-[#F7F6F2]/45">Design Roadmap</span>
            </h2>

            <p className="mt-5 max-w-xl text-base text-[#F7F6F2]/85 sm:text-lg md:mt-6">
              Receive tailored room palettes, layout suggestions, and clear
              next steps for your home, without unnecessary fluff.
            </p>

            {/* Button */}
            <Link
              href="/register"
              className="mt-8 inline-block rounded-md bg-[#F7F6F2] px-8 py-4 text-sm font-medium uppercase tracking-wide text-[#243D35] transition-all duration-300 hover:bg-white hover:scale-[1.03] md:mt-10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}