"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BackButton from "@/components/ui/back_button";

const rules = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "case",
    label: "Upper and lowercase letters",
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "At least one number",
    test: (p: string) => /\d/.test(p),
  },
  {
    id: "symbol",
    label: "At least one symbol (!@#$…)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

const levels = [
  { label: "Too weak", color: "bg-red-500", text: "text-red-600" },
  { label: "Weak", color: "bg-red-500", text: "text-red-600" },
  { label: "Fair", color: "bg-amber-400", text: "text-amber-600" },
  { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", color: "bg-emerald-600", text: "text-emerald-700" },
];

const inputClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base text-[#243D35] placeholder:text-[#243D35]/40 outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const score = useMemo(
    () => rules.filter((r) => r.test(password)).length,
    [password],
  );
  const level = levels[password ? score : 0];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (score < 3) {
      setError("Please choose a stronger password (at least “Good”).");
      return;
    }
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: String(data.get("fullName")),
        email: String(data.get("email")).trim().toLowerCase(),
        password: String(data.get("password")),
        ...({ phone: String(data.get("phone") ?? "").trim() } as any),
      });

      if (error) {
        setError(error.message ?? "Could not create your account.");
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  return (
    <section className="grid max-h-screen font-poppins lg:grid-cols-2">
      <div className="relative h-90 sm:h-72 lg:h-auto">
        <BackButton className="md:inline-flex bg-white/90 px-5 py-4" />
        <Image
          src="/register_img.png"
          alt="Modern home interior"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />

        <div className="absolute inset-x-0 bottom-6 p-6 text-[#F7F6F2] md:p-12">
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-5xl">
            Design your dream space today
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#F7F6F2]/85 sm:text-base lg:mt-4 lg:text-lg">
            Create an account to save properties and test custom room palettes.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#F7F6F2] py-10 md:pb-0 px-4 sm:px-8 md:pt-[38.5px]">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold text-[#243D35] md:text-4xl">
            Create your account
          </h1>
          <p className="mt-2 text-base text-[#243D35]/70">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-[#243D35] underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-8 flex cursor-pointer w-full items-center justify-center gap-3 rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base font-medium text-[#243D35] transition hover:bg-[#243D35] hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="my-6 flex items-center gap-4 text-sm text-[#243D35]/50">
            <span className="h-px flex-1 bg-[#243D35]/15" />
            or with email
            <span className="h-px flex-1 bg-[#243D35]/15" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-[#243D35]"
              >
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[#243D35]"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                placeholder="+251 900 000 000"
                className={inputClass}
              />
            </div>

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#243D35]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-strength"
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 8.5 4.5 9.5 7a13 13 0 01-3 4M6.1 6.1A13 13 0 002.5 12c1 2.5 4.500 7 9.500 7a9.700 9.700 0 004-.9" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 12C3.5 9.5 7 5 12 5s8.500 4.500 9.500 7c-1 2.500-4.500 7-9.500 7s-8.500-4.500-9.500-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <div id="password-strength" aria-live="polite" className="mt-3">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        password && score >= i ? level.color : "bg-[#243D35]/10"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${password ? level.text : "text-[#243D35]/50"}`}
                >
                  {password
                    ? `Password strength: ${level.label}`
                    : "Enter a password"}
                </p>

                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {rules.map((r) => {
                    const ok = r.test(password);
                    return (
                      <li
                        key={r.id}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          ok ? "text-emerald-700" : "text-[#243D35]/55"
                        }`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          {ok ? (
                            <path d="M2.5 7.5l3 3 6-6.500" />
                          ) : (
                            <circle cx="7" cy="7" r="4.5" />
                          )}
                        </svg>
                        {r.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

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
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27] active:scale-[0.99]"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-sm text-[#243D35]/60">
              By signing up you agree to our{" "}
              <Link href="/terms-services" className="underline underline-offset-2">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
