"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DASHBOARD_TITLE, getInitials } from "@/lib/user";
import type { SidebarUser } from "@/lib/user";

interface NavItem {
  key: string;
  label: string;
  href: string;
  act: string;
  icon: ReactNode;
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
    href: "/dashboard",
    act: "dashboard",
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
    act: "schedule",
    icon: (
      <svg {...ic}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    key: "activity",
    label: "My Activities",
    href: "/dashboard/activity",
    act: "activity",
    icon: (
      <svg {...ic}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    act: "profile",
    icon: (
      <svg {...ic}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const adminItem: NavItem[] = [
  {
    key: "admin",
    label: "Manage Homes",
    href: "/dashboard/admin",
    act: "admin",
    icon: (
      <svg {...ic}>
        <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
        <path d="M9 21v-7h6v7" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    act: "profile",
    icon: (
      <svg {...ic}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "preview",
    label: "Preview Room",
    href: "/dashboard",
    act: "dashboard",
    icon: (
      <svg {...ic}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
];

interface SidebarProps {
  user: SidebarUser;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  user,
  collapsed,
  mobileOpen,
  onToggle,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const onProfile = pathname?.endsWith("profile");
  const navItems = user.role === "admin" ? adminItem : items;
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
        <Link
          href="/"
          aria-label="HueEstate home"
          className="flex items-center"
        >
          <Image
            src="/logo.svg"
            width={80}
            height={40}
            alt="HueEstate"
            className={`h-auto mt-3 w-20 ${hideWhenCollapsed}`}
          />
          <div
            className={`hidden relative h-13 w-14 items-center font-semibold text-white ${
              collapsed ? "lg:flex" : ""
            }`}
          >
            <Image src="/logo.svg" fill alt="HueEstate" className={`h-auto`} />
          </div>
        </Link>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F6F2] text-[#243D35] lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="px-3 md:mt-12 mb-3">
        <Link
          href="/dashboard/profile"
          aria-current={onProfile ? "page" : undefined}
          title={collapsed ? `${user.name} · ${DASHBOARD_TITLE}` : undefined}
          className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
            onProfile ? "bg-[#243D35]/10" : "bg-[#F7F6F2] hover:bg-[#243D35]/10"
          } ${collapsed ? "lg:justify-center lg:bg-transparent lg:p-0" : ""}`}
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#243D35] text-sm font-semibold text-white">
              {getInitials(user.name)}
            </span>
          )}
          <span className={`min-w-0 ${hideWhenCollapsed}`}>
            <span className="block truncate text-sm font-semibold text-[#243D35]">
              {user.name}
            </span>
            <span className="block truncate text-xs text-[#243D35]/60">
              {DASHBOARD_TITLE}
            </span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav aria-label="Dashboard" className="flex-1 px-3 py-4 md:mt-6">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const active =
              item.act === "admin"
                ? pathname?.startsWith("/dashboard/admin")
                : pathname?.endsWith(item.act);
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
                  <span className={`truncate ${hideWhenCollapsed}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help */}
      <div className="border-t border-[#243D35]/10 p-3">
        <Link
          href="/contact-us"
          title={collapsed ? "Help" : undefined}
          className={`${row} text-[#243D35]/70 hover:bg-[#F7F6F2] hover:text-[#243D35]`}
        >
          <svg {...ic}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 114 2c-.8.6-1.5 1-1.5 2M12 17h.01" />
          </svg>
          <span className={`truncate ${hideWhenCollapsed}`}>Help</span>
        </Link>
      </div>
    </aside>
  );
}
