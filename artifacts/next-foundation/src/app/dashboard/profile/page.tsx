import Link from "next/link";
import type {Metadata} from "next"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileSummary from "@/components/dashboard/profile/ProfileSummary";
import ProfileForm from "@/components/dashboard/profile/ProfileForm";

export const metadata:Metadata = { title: "Profile | HueEstate" };

export default async function ProfilePage() {
  // Check again here: layouts don't re-run on every client navigation
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const { name, email, phone, image, emailVerified, createdAt } = session.user;

  const memberSince = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">
          Profile
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Your account
        </h1>
        <p className="text-base text-[#243D35]/70">
          Review your details and keep them up to date.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr] xl:items-start">
        <ProfileSummary
          name={name}
          email={email}
          phone={phone ?? null}
          image={image ?? null}
          verified={emailVerified}
          memberSince={memberSince}
        />

        <div className="space-y-6">
          <ProfileForm name={name} email={email} phone={phone ?? ""} />

          <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-semibold">Sign out</h2>
              <p className="mt-1 text-sm text-[#243D35]/60">
                Finished for now? You can sign back in at any time.
              </p>
            </div>
            <Link
              href="/logout"
              className="inline-flex items-center justify-center gap-3 rounded-md border border-[#243D35]/20 px-6 py-3.5 text-base font-medium transition hover:bg-[#243D35] hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9" />
              </svg>
              Log out
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}