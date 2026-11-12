"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavLink {
  key: string;
  label: string;
  ref: string;
}

const Links: NavLink[] = [
  { key: "home", label: "Home", ref: "/" },
  { key: "about", label: "About", ref: "/about" },
  { key: "get_start", label: "Get Started", ref: "/register" },
  { key: "signin", label: "Sign In", ref: "/signin" },
];

function getToday() {
  const now = new Date();
  return {
    day: now.toLocaleDateString("en-US", { weekday: "long" }),
    date: now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 10L10 2M4 2h6v6" />
  </svg>
);

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState<{ day: string; date: string } | null>(
    null
  );
  const lastY = useRef(0);

  useEffect(() => {
    setToday(getToday());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(window.scrollY, 0);
      setScrolled(y > 10);

      if (y < 80) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      const diff = y - lastY.current;
      if (Math.abs(diff) > 8) {
        setHidden(diff > 0);
        lastY.current = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showBg = scrolled || open;
  const hide = hidden && !open;

  return (
    <header
      className={`sticky top-0 z-50 px-6 transition-all duration-300 ${
        hide ? "-translate-y-full" : "translate-y-0"
      } ${
        showBg
          ? "bg-white/70 shadow-sm backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="relative mx-auto flex max-w-450 items-center justify-between py-3 font-poppins xl:py-4">
        <ul className="hidden items-center gap-1 rounded-lg bg-[#F7F6F2] p-1.5 xl:flex">
          {Links.map(({ label, key, ref }) => {
            const isActive = pathname === ref;
            return (
              <li key={key}>
                <Link
                  href={ref}
                  className={`inline-block rounded-md px-5 py-2.5 text-lg transition-colors ${
                    isActive
                      ? "bg-[#243D35] text-white"
                      : "text-gray-400 hover:text-[#243D35]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/"
          aria-label="Home"
          className="xl:absolute xl:left-1/2 xl:-translate-x-1/2"
        >
          <Image
            src={"/logo.svg"}
            width={100}
            height={100}
            alt="Logo"
            className="h-auto w-24 sm:w-28 xl:w-17"
          />
        </Link>

        <div className="hidden items-center gap-10 xl:flex">
          <div className="min-w-44 text-lg font-semibold leading-snug text-[#243D35]">
            <p>{today?.day ?? "\u00A0"}</p>
            <p>{today?.date ?? "\u00A0"}</p>
          </div>
          <Link
            href={"/contact-us"}
            className="inline-flex items-center gap-5 rounded-md bg-[#243D35] px-6 py-4 text-lg text-white"
          >
            Contact Us
            <ArrowIcon />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F7F6F2] text-[#243D35] xl:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`mx-auto grid max-w-450 font-poppins transition-[grid-template-rows,visibility] duration-300 xl:hidden ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-6 pb-6 pt-2">
            <ul className="space-y-2">
              {Links.map(({ label, key, ref }) => {
                const isActive = pathname === ref;
                return (
                  <li key={key}>
                    <Link
                      href={ref}
                      className={`block rounded-md px-5 py-3.5 text-xl transition-colors ${
                        isActive
                          ? "bg-[#243D35] text-white"
                          : "bg-[#F7F6F2] text-gray-500 hover:text-[#243D35]"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-4">
              <div className="text-base font-semibold leading-snug text-[#243D35]">
                <p>{today?.day ?? "\u00A0"}</p>
                <p>{today?.date ?? "\u00A0"}</p>
              </div>
              <Link
                href={"/contact-us"}
                className="inline-flex items-center gap-4 rounded-md bg-[#243D35] px-5 py-3.5 text-base text-white"
              >
                Contact Us
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}