import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/main/DashboardShell";
import { requireVerifiedDashboardSession } from "@/lib/dashboard-auth";

async function validateCurrentSession(): Promise<Response> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    throw new Error("Cannot validate dashboard session without a request host.");
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";
  const cookie = requestHeaders.get("cookie");

  return fetch(new URL("/api/auth/session", `${protocol}://${host}`), {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
    redirect: "manual",
  });
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireVerifiedDashboardSession(validateCurrentSession, redirect);
  return <DashboardShell>{children}</DashboardShell>;
}