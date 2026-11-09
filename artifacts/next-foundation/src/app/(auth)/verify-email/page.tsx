import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify your email | HueEstate",
};

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-6 py-12 font-poppins text-[#243D35]">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#243D35]/60">
          One more step
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Verify your email to continue
        </h1>
        <p className="mt-4 leading-7 text-[#243D35]/75">
          Open the verification link sent to your email address. If you don’t
          see it, check your spam or junk folder. Once your email is verified,
          sign in again to access your dashboard.
        </p>
        <Link
          href="/signin"
          className="mt-8 inline-flex rounded-md bg-[#243D35] px-5 py-3 font-medium text-white transition hover:bg-[#1b3029]"
        >
          Return to sign in
        </Link>
      </section>
    </main>
  );
}
