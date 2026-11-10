"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function confirmLogout() {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/signin") },
    });
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 py-10 font-poppins text-[#243D35]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F6F2]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9" />
          </svg>
        </span>

        <h1 className="mt-6 text-3xl font-semibold">Sign out?</h1>
        <p className="mt-3 text-base text-[#243D35]/70">
          You&apos;ll need to sign in again to preview rooms, manage your
          schedule, and see your saved homes.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={confirmLogout}
            disabled={loading}
            className="w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing out..." : "Confirm"}
          </button>
          <Link
            href="/dashboard"
            aria-disabled={loading}
            className={`w-full rounded-md border border-[#243D35]/20 px-6 py-4 text-base font-medium transition hover:border-[#243D35] ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  );
}