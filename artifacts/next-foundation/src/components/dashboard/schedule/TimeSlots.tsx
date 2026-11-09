import { formatTime, timeSlots } from "@/lib/schedule";

interface TimeSlotsProps {
  taken: string[];
  selected: string | null;
  onSelect: (time: string) => void;
}

export default function TimeSlots({ taken, selected, onSelect }: TimeSlotsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {timeSlots.map((time) => {
        const isTaken = taken.includes(time);
        const isSelected = selected === time;

        return (
          <button
            key={time}
            type="button"
            disabled={isTaken}
            onClick={() => onSelect(time)}
            aria-pressed={isSelected}
            className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
              isSelected
                ? "border-[#243D35] bg-[#243D35] text-white"
                : isTaken
                  ? "cursor-not-allowed border-transparent bg-[#F7F6F2] text-[#243D35]/30 line-through"
                  : "border-[#243D35]/15 hover:border-[#243D35]"
            }`}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}