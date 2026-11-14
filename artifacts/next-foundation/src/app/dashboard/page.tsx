import { getHouses } from "@/lib/house-queries";
import PreviewRoom from "@/components/dashboard/main/PreviewRoom";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const houses = await getHouses();

  if (houses.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">No homes yet</h1>
        <p className="mt-3 text-[#243D35]/70">Homes will appear here as soon as they are added.</p>
      </div>
    );
  }

  return <PreviewRoom houses={houses} />;
}