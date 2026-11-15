import type { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 py-10 font-poppins text-[#243D35]">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-10">{children}</div>
    </section>
  );
}