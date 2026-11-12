"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-[#243D35] px-6 py-3.5 text-base font-medium text-white transition hover:bg-[#1a2d27]"
    >
      Download receipt (PDF)
    </button>
  );
}