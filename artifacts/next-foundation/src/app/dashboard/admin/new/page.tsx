import type {Metadata} from "next"
import Link from "next/link";
import HouseForm from "@/components/admin/HouseForm";

export const metadata:Metadata = { title: "Add a home | HueEstate" };

export default function NewHomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <Link href="/dashboard/admin" className="text-sm text-[#243D35]/60 underline underline-offset-4">
          ← Back to homes
        </Link>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Add a home</h1>
      </header>
      <HouseForm />
    </div>
  );
}