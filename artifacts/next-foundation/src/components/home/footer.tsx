import Image from "next/image";
import Link from "next/link";

const linkGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Get Started", href: "/get-started" },
      { label: "Sign In", href: "/signin" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Properties", href: "/#properties" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Intelligent Studio", href: "/#studio" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

const socials = [
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6H16.7V4.3C16.4 4.3 15.5 4.2 14.5 4.2c-2.2 0-3.7 1.3-3.7 3.8v2.5H8.3v3h2.5V21h2.7z",
  },
  {
    label: "X",
    href: "#",
    path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.9-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM21 8.6c-.1-1.5-.4-2.8-1.5-3.9S17 3.2 15.4 3.1C13.9 3 10.1 3 8.6 3.1 7.1 3.2 5.8 3.5 4.7 4.6S3.2 7 3.1 8.6C3 10.1 3 13.9 3.1 15.4c.1 1.5.4 2.8 1.5 3.9s2.4 1.5 3.9 1.6c1.5.1 5.3.1 6.8 0 1.5-.1 2.8-.4 3.9-1.5s1.5-2.4 1.6-3.9c.1-1.5.1-5.3 0-6.9zm-2 8.2a3.2 3.2 0 01-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.400.1-5.700-.4a3.200 3.200 0 01-1.800-1.800c-.5-1.300-.4-4.300-.4-5.700s-.1-4.400.4-5.700a3.200 3.200 0 011.800-1.800c1.300-.5 4.300-.4 5.700-.4s4.400-.1 5.700.4a3.200 3.200 0 011.800 1.800c.5 1.300.4 4.300.4 5.700s.1 4.400-.4 5.700z",
  },
  {
    label: "Threads",
    href: "#",
    path: "M12.2 21c-3.900 0-6.800-2.600-6.800-7.100V10c0-4.400 2.800-7 6.700-7 3.200 0 5.600 1.700 6.300 4.500l-1.900.5c-.5-1.900-2.100-3.100-4.400-3.100-2.800 0-4.700 1.900-4.700 5.100v3.900c0 3.300 1.900 5.100 4.800 5.100 2.600 0 4.100-1.300 4.100-3.100 0-1.500-1-2.400-2.800-2.600-.4 1.500-1.500 2.300-3 2.300-1.700 0-2.900-1.100-2.900-2.700 0-1.700 1.300-2.800 3.300-2.800 2.800 0 5.200 1.300 5.200 4 0 2.700-2.300 4.600-6 4.600l.1-.1z",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#243D35] font-poppins text-[#F7F6F2]">
      <Image
        src="/footer_bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-[#243D35]/70 via-[#243D35]/80 to-[#243D35]"
      />

      <div className="relative mx-auto max-w-450 px-4 pt-16 md:px-12 md:pt-24">
        {/* Top: giant wordmark + description */}
        <div>
          <p
            aria-hidden="true"
            className="select-none text-[22vw] font-semibold leading-[0.85] tracking-tighter text-[#F7F6F2] md:text-[18vw] lg:text-[15vw]"
          >
            HueEstate
          </p>
          <p className="mt-6 max-w-xl text-base text-[#F7F6F2]/85 md:mt-8 md:text-lg">
            Explore white canvas residences, test real time room palettes, and
            shape your space with complete confidence.
          </p>
        </div>

        {/* Middle: socials + link columns */}
        <div className="mt-14 flex flex-col gap-12 md:mt-24 lg:flex-row lg:items-end lg:justify-between">
          {/* Socials */}
          <ul className="flex items-center gap-3 lg:self-end">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F7F6F2]/20 bg-[#243D35]/40 backdrop-blur-sm transition-colors duration-300 hover:bg-[#F7F6F2] hover:text-[#243D35] md:h-14 md:w-14"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-16">
            {linkGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="text-lg font-medium text-[#F7F6F2]">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3 md:mt-7 md:space-y-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-base text-[#F7F6F2]/75 transition-colors duration-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-2 border-t border-[#F7F6F2]/15 py-6 text-sm text-[#F7F6F2]/75 sm:flex-row sm:items-center sm:justify-between md:mt-20 md:text-base">
          <p>© {new Date().getFullYear()} HueEstate. All rights reserved.</p>
          <p>Designed by Kalid Abdifeta.</p>
        </div>
      </div>
    </footer>
  );
}