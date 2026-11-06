"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  soon?: boolean;
}

const ic = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const items: NavItem[] = [
  {
    key: "preview",
    label: "Preview Room",
    href: "/dashboard/preview",
    icon: (
      <svg {...ic}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
  {
    key: "schedule",
    label: "Make a Schedule",
    href: "/dashboard/schedule",
    soon: true,
    icon: (
      <svg {...ic}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    soon: true,
    icon: (
      <svg {...ic}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    key: "ai",
    label: "AI",
    href: "/dashboard/ai",
    soon: true,
    icon: (
      <svg {...ic}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  // "collapsed" only applies from lg up. On mobile the drawer is always full.
  const hideWhenCollapsed = collapsed ? "lg:hidden" : "";
  const row = `relative flex items-center gap-4 rounded-xl px-3.5 py-3.5 text-base transition-colors ${
    collapsed ? "lg:justify-center lg:px-0" : ""
  }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#243D35]/10 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${collapsed ? "lg:w-20" : "lg:w-72"}`}
    >
      {/* Desktop collapse toggle, floating on the edge */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="absolute -right-3 top-7 hidden h-6 w-6 items-center justify-center rounded-full border border-[#243D35]/15 bg-white text-[#243D35] shadow-sm transition hover:bg-[#243D35] hover:text-white lg:flex"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        >
          <path d="M7.5 2.5L4 6l3.5 3.5" />
        </svg>
      </button>

      {/* Header */}
      <div
        className={`flex h-20 items-center justify-between px-5 ${
          collapsed ? "lg:justify-center lg:px-0" : ""
        }`}
      >
        <Link href="/" aria-label="HueEstate home" className="flex items-center">
          <Image
            src="/logo.png"
            width={112}
            height={40}
            alt="HueEstate"
            className={`h-auto w-28 ${hideWhenCollapsed}`}
          />
          <span
            className={`hidden h-10 w-10 items-center justify-center rounded-lg bg-[#243D35] font-semibold text-white ${
              collapsed ? "lg:flex" : ""
            }`}
          >
            H
          </span>
        </Link>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F6F2] text-[#243D35] lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Dashboard" className="flex-1 px-3 py-4">
        <ul className="space-y-1.5">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);

            if (item.soon) {
              return (
                <li key={item.key}>
                  <span
                    aria-disabled="true"
                    title={collapsed ? `${item.label} (soon)` : undefined}
                    className={`${row} cursor-not-allowed text-[#243D35]/40`}
                  >
                    {item.icon}
                    <span className={`truncate ${hideWhenCollapsed}`}>{item.label}</span>
                    <span
                      className={`ml-auto rounded-full bg-[#F7F6F2] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${hideWhenCollapsed}`}
                    >
                      Soon
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={`${row} ${
                    active
                      ? "bg-[#243D35] text-white"
                      : "text-[#243D35]/70 hover:bg-[#F7F6F2] hover:text-[#243D35]"
                  }`}
                >
                  {item.icon}
                  <span className={`truncate ${hideWhenCollapsed}`}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#243D35]/10 p-3">
        <Link
          href="/"
          title={collapsed ? "Back to website" : undefined}
          className={`${row} text-[#243D35]/70 hover:bg-[#F7F6F2] hover:text-[#243D35]`}
        >
          <svg {...ic}>
            <path d="M20 12H4M9 7l-5 5 5 5" />
          </svg>
          <span className={`truncate ${hideWhenCollapsed}`}>Back to website</span>
        </Link>
      </div>
    </aside>
  );
}