"use client";

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

const DAY = "Sunday";
const DATE_RANGE = "17.06 - 27 June 2026";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="px-6">
      <nav className="relative flex font-poppins justify-between items-center py-5 max-w-450 mx-auto">
        <ul className="flex items-center font-poppins gap-1 p-1.5 bg-[#F7F6F2] rounded-lg">
          {Links.map(({ label, key, ref }) => {
            const isActive = pathname === ref;
            return (
              <li key={key}>
                <Link
                  href={ref}
                  className={`inline-block px-5 py-2.5 text-lg rounded-md transition-colors ${
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
        <div className="absolute left-1/2 -translate-x-1/2">
          <Image src={"/logo.png"} width={120} height={120} alt="Logo SVG" />
        </div>

        <div className="flex items-center gap-10">
          <div className="text-lg font-semibold leading-snug text-[#243D35]">
            <p>{DAY}</p>
            <p>{DATE_RANGE}</p>
          </div>
          <Link
            href={"/contact-us"}
            className="inline-flex items-center font-poppins gap-5 px-6 py-4 bg-[#243D35] text-lg rounded-md text-white"
          >
            Contact Us
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
          </Link>
        </div>
      </nav>
    </header>
  );
}