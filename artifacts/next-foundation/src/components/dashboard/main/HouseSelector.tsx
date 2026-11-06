import Image from "next/image";
import type { House } from "@/lib/houses";

interface HouseSelectorProps {
  houses: House[];
  activeId: string;
  onSelect: (id: string) => void;
}

const price = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function HouseSelector({ houses, activeId, onSelect }: HouseSelectorProps) {
  return (
    <section aria-label="Choose a home" className="rounded-2xl bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Explore homes</h2>
        <span className="font-mono text-xs uppercase tracking-wide text-[#243D35]/50">
          {houses.length} available
        </span>
      </div>

      <ul className="flex snap-x gap-3 overflow-x-auto p-1 pb-3">
        {houses.map((house) => {
          const active = house.id === activeId;
          return (
            <li key={house.id} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => onSelect(house.id)}
                aria-pressed={active}
                className={`group relative block h-32 w-56 overflow-hidden rounded-xl transition sm:h-36 sm:w-64 ${
                  active ? "ring-2 ring-[#243D35] ring-offset-2" : "opacity-85 hover:opacity-100"
                }`}
              >
                <Image
                  src={house.thumb}
                  alt=""
                  fill
                  sizes="256px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                <span className="absolute right-2.5 top-2.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  360° · {house.rooms.length} {house.rooms.length === 1 ? "room" : "rooms"}
                </span>

                <span className="absolute inset-x-0 bottom-0 p-3 text-left text-white">
                  <span className="block truncate text-sm font-semibold">{house.name}</span>
                  <span className="block truncate text-xs text-white/80">
                    {house.location} · {price.format(house.price)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}