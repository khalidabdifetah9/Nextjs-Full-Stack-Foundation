"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

const inputClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base text-[#243D35] placeholder:text-[#243D35]/40 outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      // replace with your API call, e.g. signIn("credentials", { email, password })
      console.log({ email, password, remember: data.get("remember") === "on" });
    } catch {
      setError("Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    // e.g. next-auth: signIn("google")
    console.log("Google sign in");
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#F7F6F2] px-4 py-10 font-poppins sm:py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold text-[#243D35] md:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-base text-[#243D35]/70">
          New here?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#243D35] underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base font-medium text-[#243D35] transition hover:bg-[#243D35] hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          Sign in with Google
        </button>

        <div className="my-6 flex items-center gap-4 text-sm text-[#243D35]/50">
          <span className="h-px flex-1 bg-[#243D35]/15" />
          or with email
          <span className="h-px flex-1 bg-[#243D35]/15" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#243D35]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#243D35]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#243D35]/70 underline-offset-4 transition hover:text-[#243D35] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#243D35]/60 transition hover:text-[#243D35]"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 8.5 4.5 9.5 7a13 13 0 01-3 4M6.1 6.1A13 13 0 002.5 12c1 2.5 4.5 7 9.5 7a9.7 9.7 0 004-.9" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 12C3.5 9.5 7 5 12 5s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7s-8.5-4.5-9.5-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#243D35]/80">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-[#243D35]/30 accent-[#243D35]"
            />
            Keep me signed in
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}