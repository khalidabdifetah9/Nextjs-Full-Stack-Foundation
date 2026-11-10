import { DASHBOARD_TITLE, getInitials } from "@/lib/user";

interface ProfileSummaryProps {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  verified: boolean;
  memberSince: string;
}

export default function ProfileSummary({
  name,
  email,
  phone,
  image,
  verified,
  memberSince,
}: ProfileSummaryProps) {
  const details = [
    { label: "Email", value: email },
    { label: "Phone", value: phone || "Not added" },
    { label: "Member since", value: memberSince },
  ];

  return (
    <section className="rounded-2xl bg-white p-5 sm:p-6">
      <div className="flex flex-col items-center text-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#243D35] text-3xl font-semibold text-white">
            {getInitials(name)}
          </span>
        )}
        <h2 className="mt-5 text-2xl font-semibold">{name}</h2>
        <p className="mt-1 text-sm text-[#243D35]/60">{DASHBOARD_TITLE}</p>

        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F7F6F2] px-3 py-1.5 text-xs font-medium">
          <span className={`h-2 w-2 rounded-full ${verified ? "bg-emerald-600" : "bg-amber-500"}`} />
          {verified ? "Email verified" : "Email not verified"}
        </span>
      </div>

      <dl className="mt-6 divide-y divide-[#243D35]/10 border-t border-[#243D35]/10">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between gap-4 py-3.5 text-sm">
            <dt className="text-[#243D35]/60">{d.label}</dt>
            <dd className="min-w-0 truncate font-medium">{d.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}