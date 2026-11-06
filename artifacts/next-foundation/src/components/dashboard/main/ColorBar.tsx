"use client";

import { palette } from "@/lib/colors"

interface ColorBarProps {
  color: string | null;
  strength: number; // 0..1
  disabled?: boolean;
  onColorChange: (color: string | null) => void;
  onStrengthChange: (strength: number) => void;
}

export default function ColorBar({
  color,
  strength,
  disabled = false,
  onColorChange,
  onStrengthChange,
}: ColorBarProps) {
  const selectedName = color
    ? palette.find((p) => p.hex.toLowerCase() === color.toLowerCase())?.name ?? "Custom"
    : "Original";

  return (
    <section aria-label="Wall color" className="rounded-2xl bg-white p-4 sm:p-5">
      <fieldset
        disabled={disabled}
        className="flex flex-col gap-4 disabled:opacity-50 xl:flex-row xl:items-center xl:gap-6"
      >
        <legend className="sr-only">Choose a wall color</legend>

        <div className="flex items-baseline justify-between gap-4 xl:block xl:w-36 xl:shrink-0">
          <h2 className="text-lg font-semibold">Wall color</h2>
          <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/50">
            {selectedName}
          </p>
        </div>

        {/* Swatches */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto p-1.5">
          <button
            type="button"
            onClick={() => onColorChange(null)}
            aria-label="Original color"
            aria-pressed={color === null}
            title="Original"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white text-[#243D35]/60 transition-transform hover:scale-105 ${
              color === null
                ? "border-[#243D35] ring-2 ring-[#243D35] ring-offset-2"
                : "border-[#243D35]/25"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" />
              <path d="M4 12L12 4" />
            </svg>
          </button>

          {palette.map((p) => {
            const active = color?.toLowerCase() === p.hex.toLowerCase();
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onColorChange(p.hex)}
                aria-label={p.name}
                aria-pressed={active}
                title={p.name}
                style={{ backgroundColor: p.hex }}
                className={`h-9 w-9 shrink-0 rounded-full transition-transform hover:scale-105 ${
                  active ? "ring-2 ring-[#243D35] ring-offset-2" : "ring-1 ring-black/10"
                }`}
              />
            );
          })}
        </div>

        {/* Custom + strength */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 xl:shrink-0">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-full border border-[#243D35]/15 py-1.5 pl-4 pr-2 text-sm transition-colors hover:border-[#243D35]/40">
            Custom
            <input
              type="color"
              value={color ?? "#a8b5a0"}
              onChange={(e) => onColorChange(e.target.value)}
              aria-label="Custom color"
              className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>

          <div className="flex items-center gap-3 text-sm">
            <label htmlFor="strength" className="shrink-0 font-medium">
              Strength
            </label>
            <input
              id="strength"
              type="range"
              min={10}
              max={100}
              step={1}
              value={Math.round(strength * 100)}
              onChange={(e) => onStrengthChange(Number(e.target.value) / 100)}
              className="w-full accent-[#243D35] sm:w-36"
            />
            <span className="w-10 shrink-0 text-right font-mono text-[#243D35]/70">
              {Math.round(strength * 100)}%
            </span>
          </div>
        </div>
      </fieldset>

      {disabled && (
        <p className="mt-3 rounded-lg bg-[#F7F6F2] px-4 py-3 text-sm text-[#243D35]/70">
          Color preview isn&apos;t available for this room yet.
        </p>
      )}
    </section>
  );
}