import type {Metadata} from "next"
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata:Metadata = { title: "Reset password | HueEstate", referrer: "no-referrer" as const };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (error || !token) {
    return (
      <AuthCard>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">This link isn&apos;t valid</h1>
          <p className="mt-3 text-base text-[#243D35]/70">
            The reset link is invalid, has expired, or was already used. Request a new one to continue.
          </p>
          <Link
            href="/forgot-password"
            className="mt-8 block w-full rounded-md bg-[#243D35] px-6 py-4 text-base font-medium text-white transition hover:bg-[#1a2d27]"
          >
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}