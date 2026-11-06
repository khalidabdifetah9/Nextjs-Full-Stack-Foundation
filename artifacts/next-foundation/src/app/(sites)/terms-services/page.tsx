import Link from "next/link";
import { sections } from "@/lib/terms";
const EMAIL = "legal@hueestate.com";
const LAST_UPDATED = "November 4, 2026";

export default function TermsOfService() {
  return (
    <section className="mt-10 px-12 font-poppins md:mt-16">
      <header className="max-w-3xl space-y-4 md:space-y-6">
        <h1 className="text-4xl font-semibold leading-tight text-[#243D35] sm:text-5xl lg:text-6xl">
          Terms of Service
        </h1>
        <p className="text-base text-[#243D35]/70 sm:text-lg">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="mt-12 grid gap-10 border-t border-[#243D35]/15 pt-10 md:mt-16 lg:grid-cols-[1fr_2.5fr] lg:gap-40 lg:pt-14">
        <nav
          aria-label="Table of contents"
          className="hidden self-start lg:sticky lg:top-28 lg:block"
        >
          <p className="font-mono text-sm uppercase tracking-wide text-[#243D35]/60">
            On this page
          </p>
          <ol className="mt-5 space-y-3">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex gap-3 text-base text-[#243D35]/70 transition-colors hover:text-[#243D35]"
                >
                  <span className="font-mono text-sm text-[#243D35]/40 group-hover:text-[#243D35]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-28 border-b border-[#243D35]/15 py-8 first:pt-0 last:border-b-0 md:py-10 md:first:pt-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-[#243D35]/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl font-semibold text-[#243D35] md:text-3xl">
                  {s.title}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-base leading-relaxed text-[#243D35]/75 md:pl-10 md:text-lg">
                {s.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}

                {s.bullets && (
                  <ul className="space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-[#243D35]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.id === "contact" && (
                  <p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="font-medium text-[#243D35] underline underline-offset-4"
                    >
                      {EMAIL}
                    </a>
                    {" · "}
                    <Link
                      href="/privacy"
                      className="font-medium text-[#243D35] underline underline-offset-4"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
