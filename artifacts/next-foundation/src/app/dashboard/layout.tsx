import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/main/DashboardShell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/signin");

  const { name, email, image } = session.user;

  return (
    <DashboardShell user={{ name, email, image: image ?? null }}>
      {children}
    </DashboardShell>
  );
}