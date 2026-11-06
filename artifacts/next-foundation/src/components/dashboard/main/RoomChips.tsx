import type { HouseRoom } from "@/lib/houses";

interface RoomChipsProps {
  rooms: HouseRoom[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function RoomChips({ rooms, activeId, onSelect }: RoomChipsProps) {
  if (rooms.length < 2) return null;

  return (
    <ul className="flex max-w-full gap-2 overflow-x-auto">
      {rooms.map((r) => {
        const active = r.id === activeId;
        return (
          <li key={r.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-xs font-medium backdrop-blur-md transition sm:text-sm ${
                active ? "bg-white text-[#243D35]" : "bg-black/35 text-white hover:bg-black/55"
              }`}
            >
              {r.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}