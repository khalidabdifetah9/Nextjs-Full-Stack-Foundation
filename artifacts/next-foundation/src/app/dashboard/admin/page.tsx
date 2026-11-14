import type {Metadata} from "next"
import Link from "next/link";
import { getAdminHouses } from "@/lib/admin-queries";
import HouseActions from "@/components/admin/HouseActions";

export const metadata:Metadata = { title: "Manage homes | HueEstate" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const homes = await getAdminHouses();

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">Admin</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Manage homes</h1>
          <p className="text-base text-[#243D35]/70">Add, edit, hide or delete the homes users can preview.</p>
        </div>
        <Link
          href="/dashboard/admin/new"
          className="rounded-md bg-[#243D35] px-6 py-3.5 text-center text-base font-medium text-white transition hover:bg-[#1a2d27]"
        >
          + Add a home
        </Link>
      </header>

      {homes.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="text-[#243D35]/70">No homes yet. Add your first one.</p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {homes.map((home) => (
            <li key={home.id} className="overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-3/2 bg-[#F7F6F2]">
                {home.thumbUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={home.thumbUrl} alt="" className="h-full w-full object-cover" />
                )}
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                    home.published ? "bg-emerald-600 text-white" : "bg-black/60 text-white"
                  }`}
                >
                  {home.published ? "Published" : "Hidden"}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="truncate text-lg font-semibold">{home.name}</h2>
                  <p className="truncate text-sm text-[#243D35]/60">{home.location}</p>
                  <p className="mt-2 text-sm text-[#243D35]/70">
                    {home.status} · ETB {home.price.toLocaleString("en-US")} · {home.rooms}{" "}
                    {home.rooms === 1 ? "room" : "rooms"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/admin/${home.id}`}
                    className="rounded-md bg-[#243D35] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2d27]"
                  >
                    Edit
                  </Link>
                  <HouseActions id={home.id} name={home.name} published={home.published} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}