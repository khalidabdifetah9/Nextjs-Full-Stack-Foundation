"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const fieldClass =
  "w-full border-b border-[#243D35]/20 bg-transparent py-4 text-base text-[#243D35] placeholder:text-[#243D35]/50 outline-none transition-colors focus:border-[#243D35]";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const info = [
  {
    id: "email",
    text: "hello@HueEstate.com",
    href: "mailto:hello@HueEstate.com",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 6l9 7 9-7" />
      </svg>
    ),
  },
  {
    id: "phone",
    text: "+251 945 630 720",
    href: "tel:+251945630720",
    icon: (
      <svg {...iconProps}>
        <path d="M5 4h4l2 5-2.5 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    id: "address",
    text: "14 Greenroad St.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 21s7-6.200 7-11a7 7 0 10-14 0c0 4.800 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.500" />
      </svg>
    ),
  },
  {
    id: "hours",
    text: "09:00 - 18:00",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.500 21v-7.500h2.500l.5-3h-3V8.600c0-.9.3-1.600 1.600-1.600H16.700V4.300C16.400 4.300 15.500 4.200 14.500 4.200c-2.200 0-3.700 1.300-3.700 3.800v2.500H8.300v3h2.500V21h2.700z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.500" cy="6.500" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.800 3h3.100l-6.800 7.700L22 21h-6.200l-4.900-6.400L5.300 21H2.200l7.300-8.300L2 3h6.400l4.400 5.800L17.800 3zm-1.100 16.200h1.700L7.400 4.700H5.600l11.100 14.500z" />
      </svg>
    ),
  },
];

export default function ContactUs() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(Object.fromEntries(data));
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <section className="mt-10 font-poppins md:mt-16">
      <div className="grid overflow-hidden bg-white shadow-xl shadow-[#243D35]/10 lg:grid-cols-[1fr_1.1fr]">
        {/* Left: info card with accent blocks (shown second on mobile) */}
        <div className="relative order-2 py-14 pr-6 sm:pr-12 lg:order-1 lg:pr-0">
          {/* Accent block (top) */}
          <span aria-hidden="true" className="absolute left-0 top-0 h-14 w-2/5 bg-[#DCD9CE]" />

          {/* Dark card */}
          <div className="relative bg-[#243D35] p-8 text-[#F7F6F2] sm:p-10 lg:p-12">
            {/* Small accent square on the corner */}
            <span aria-hidden="true" className="absolute -right-3 -top-3 h-6 w-6 bg-[#DCD9CE]" />

            <h2 className="text-2xl font-semibold sm:text-3xl">Info</h2>

            <ul className="mt-8 space-y-7 sm:space-y-9">
              {info.map((item) => (
                <li key={item.id} className="flex items-center gap-5 text-sm sm:text-base">
                  <span className="shrink-0 text-[#F7F6F2]/80">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} className="break-all transition-opacity hover:opacity-70">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Accent block (bottom) with socials */}
          <div className="absolute left-0 flex h-14 w-2/5 items-center justify-center gap-5 bg-[#DCD9CE] text-[#243D35]">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="transition-opacity hover:opacity-60"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right: form (shown first on mobile) */}
        <div className="order-1 px-6 py-3 sm:px-12 lg:order-2 lg:py-24 lg:pl-66 lg:pr-25">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <h1 className="text-4xl font-semibold leading-tight text-[#243D35] sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-5 text-base text-[#243D35]/70">
              Feel free to contact us any time. We will get back to you as soon
              as we can!
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-3">
              <label htmlFor="name" className="sr-only">Name</label>
              <input id="name" name="name" type="text" required autoComplete="name" placeholder="Name" className={fieldClass} />

              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="Email" className={fieldClass} />

              <label htmlFor="message" className="sr-only">Message</label>
              <textarea id="message" name="message" required rows={3} placeholder="Message" className={`${fieldClass} resize-none`} />

              <button
                type="submit"
                className="mt-8 w-full bg-[#243D35] px-6 py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#1a2d27]"
              >
                Send
              </button>

              <p role="status" aria-live="polite" className="min-h-6 pt-2 text-sm text-[#243D35]/70">
                {sent ? "Thank you! Your message has been sent." : ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}