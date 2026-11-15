"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base text-[#243D35] placeholder:text-[#243D35]/40 outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15";

// Same rule as sign up: at least 3 of lowercase, uppercase, number, symbol
function strongEnough(p: string) {
  return [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length >= 3;
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (!strongEnough(password)) {
      setError("Use at least 3 of: lowercase letters, uppercase letters, numbers and symbols.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    setError("");
    setLoading(true);
    const { error: resetError } = await authClient.resetPassword({ newPassword: password, token });
    setLoading(false);

    if (resetError) {
      setError(
        resetError.code === "INVALID_TOKEN"
          ? "This link is invalid or has expired. Please request a new one."
          : resetError.message ?? "We couldn't reset your password. Please try again."
      );
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-semibold">Password updated</h1>
        <p className="mt-3 text-base text-[#243D35]/70">You can now sign in with your new password.</p>
        <Link
          href="/signin"
          className="mt-8 block w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27]"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-semibold md:text-4xl">Choose a new password</h1>
      <p className="mt-2 text-base text-[#243D35]/70">Make it at least 8 characters and hard to guess.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-2 block text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#243D35]/80">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
            className="h-4 w-4 accent-[#243D35]"
          />
          Show passwords
        </label>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}{" "}
            {error.includes("expired") && (
              <Link href="/forgot-password" className="font-medium underline underline-offset-4">
                Request a new link
              </Link>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Reset password"}
        </button>
      </form>
    </>
  );
}