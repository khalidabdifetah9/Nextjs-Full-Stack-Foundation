import type {Metadata} from "next"
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHouseForEdit } from "@/lib/admin-queries";
import HouseForm from "@/components/admin/HouseForm";

export const metadata:Metadata = { title: "Edit home | HueEstate" };
export const dynamic = "force-dynamic";

export default async function EditHomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const home = await getHouseForEdit(id);
  if (!home) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <Link href="/dashboard/admin" className="text-sm text-[#243D35]/60 underline underline-offset-4">
          ← Back to homes
        </Link>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Edit {home.name}</h1>
      </header>
      <HouseForm initial={home} />
    </div>
  );
}