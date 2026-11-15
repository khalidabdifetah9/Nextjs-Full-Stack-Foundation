"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base text-[#243D35] placeholder:text-[#243D35]/40 outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    const { error: requestError } = await authClient.requestPasswordReset({
      email: value,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (requestError) {
      setError(requestError.message ?? "Something went wrong. Please try again.");
      return;
    }
    setSent(true); // the same message appears whether or not the email has an account
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F6F2]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-semibold">Check your email</h1>
        <p className="mt-3 text-base text-[#243D35]/70">
          If an account exists for <span className="font-medium text-[#243D35]">{email.trim()}</span>, we&apos;ve sent a
          link to reset your password. It expires in 1 hour.
        </p>
        <p className="mt-3 text-sm text-[#243D35]/60">Nothing there? Check your spam folder.</p>

        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 w-full rounded-md border border-[#243D35]/20 px-6 py-4 text-base font-medium transition hover:border-[#243D35]"
        >
          Use a different email
        </button>
        <Link href="/signin" className="mt-4 inline-block text-sm underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-semibold md:text-4xl">Forgot your password?</h1>
      <p className="mt-2 text-base text-[#243D35]/70">
        Enter your email and we&apos;ll send you a link to choose a new one.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <p className="text-center text-sm">
          <Link href="/signin" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </form>
    </>
  );
}