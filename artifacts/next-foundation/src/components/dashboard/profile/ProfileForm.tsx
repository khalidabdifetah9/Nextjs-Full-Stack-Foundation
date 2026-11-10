"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3.5 text-base text-[#243D35] placeholder:text-[#243D35]/40 outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15 read-only:cursor-not-allowed read-only:bg-[#F7F6F2] read-only:text-[#243D35]/60";

interface ProfileFormProps {
  name: string;
  email: string;
  phone: string;
}

export default function ProfileForm({ name, email, phone }: ProfileFormProps) {
  const router = useRouter();

  const [saved, setSaved] = useState({ fullName: name, phone });
  const [values, setValues] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const dirty = values.fullName !== saved.fullName || values.phone !== saved.phone;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);

    const fullName = values.fullName.trim();
    const newPhone = values.phone.trim();

    if (fullName.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (newPhone && !/^\+?[0-9\s-]{7,15}$/.test(newPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setError("");
    setSaving(true);

    const { error: updateError } = await authClient.updateUser({
      name: fullName,
      ...(newPhone ? { phone: newPhone } : {}),
    });

    setSaving(false);

    if (updateError) {
      // A phone number already used by another account fails the unique check
      setError(updateError.message ?? "Could not update your profile. Please try again.");
      return;
    }

    const next = { fullName, phone: newPhone };
    setSaved(next);
    setValues(next);
    setSuccess(true);
    router.refresh(); // re-runs the layout so the sidebar shows the new name
  }

  function reset() {
    setValues(saved);
    setError("");
    setSuccess(false);
  }

  return (
    <section className="rounded-2xl bg-white p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Personal details</h2>
      <p className="mt-1 text-sm text-[#243D35]/60">
        Update how your name and contact details appear on your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => setValues({ ...values, fullName: e.target.value })}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+251 900 000 000"
              value={values.phone}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input id="email" type="email" value={email} readOnly className={fieldClass} />
          <p className="mt-2 text-xs text-[#243D35]/50">
            Your email is your sign in and can&apos;t be changed here.
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Your profile has been updated.
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty || saving}
            className="rounded-md border border-[#243D35]/20 px-6 py-3.5 text-base font-medium transition hover:border-[#243D35] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={!dirty || saving}
            className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}