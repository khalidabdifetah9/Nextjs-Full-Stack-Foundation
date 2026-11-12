import type { House } from "@/lib/houses";
import Payment from "./Payment";
const price = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

const icons = {
  bed: "M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 15h18M7 9V6h10v3",
  bath: "M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 014 0M7 19l-1 2M17 19l1 2",
  area: "M4 4h16v16H4zM4 10h6V4",
  car: "M5 16l1.5-5h11L19 16M5 16h14v3H5zM7 19v1M17 19v1",
  calendar: "M3 6h18v15H3zM3 10h18M8 3v4M16 3v4",
  lot: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
};

function Stat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof icons;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F7F6F2] p-4">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-[#243D35]/70"
      >
        <path d={icons[icon]} />
      </svg>
      <p className="mt-3 text-lg font-semibold leading-none">{value}</p>
      <p className="mt-1.5 text-xs text-[#243D35]/60">{label}</p>
    </div>
  );
}

export default function HouseDetails({ house }: { house: House }) {
  return (
    <aside className="rounded-2xl bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#243D35] px-3 py-1 text-xs font-medium text-white">
          {house.status}
        </span>
        <span className="font-mono text-xs uppercase tracking-wide text-[#243D35]/50">
          {house.type}
        </span>
      </div>

      <h2 className="mt-5 text-2xl font-semibold leading-tight">
        {house.name}
      </h2>

      <p className="mt-2 flex items-center gap-2 text-sm text-[#243D35]/70">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {house.location}
      </p>

      <p className="mt-6 text-3xl font-semibold tracking-tight">
        {price.format(house.price)}
        {house.status === "For Rent" && (
          <span className="text-base font-normal text-[#243D35]/60">
            {" "}
            / month
          </span>
        )}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat icon="bed" label="Bedrooms" value={String(house.bedrooms)} />
        <Stat icon="bath" label="Bathrooms" value={String(house.bathrooms)} />
        <Stat
          icon="area"
          label="Area"
          value={`${house.sqft.toLocaleString("en-US")} sqft`}
        />
        <Stat icon="car" label="Garage" value={`${house.garage} `} />
        <Stat
          icon="calendar"
          label="Year built"
          value={String(house.yearBuilt)}
        />
        <Stat icon="lot" label="Lot size" value={house.lotSize} />
      </div>
      <Payment status={house.status} />
      <div className="mt-6 border-t border-[#243D35]/10 pt-6">
        <h3 className="text-sm font-semibold">About this home</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#243D35]/70">
          {house.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {house.features.map((f) => (
            <li
              key={f}
              className="rounded-full border border-[#243D35]/15 px-3 py-1.5 text-xs text-[#243D35]/80"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
