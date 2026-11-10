import type { ReactNode } from "react";

import DashboardShell from "@/components/dashboard/main/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
