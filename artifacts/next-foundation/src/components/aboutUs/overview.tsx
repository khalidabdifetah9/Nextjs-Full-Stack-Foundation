const stats = [
  { id: "years", value: "10+", label: "Years of experience" },
  { id: "homes", value: "250+", label: "Spaces designed" },
  { id: "clients", value: "98%", label: "Client satisfaction" },
];
export default function OverView() {
  return (
    <section className="bg-white font-poppins pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="grid gap-10 border-t border-[#243D35]/15 pt-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:pt-14">
        <div className="space-y-5">
          <p className="max-w-xl text-xl font-medium leading-snug text-[#243D35] sm:text-2xl md:text-3xl">
            We blend architecture and intelligent design to help you shape
            spaces that feel unmistakably yours.
          </p>
          <p className="max-w-xl text-base text-[#243D35]/70 md:text-lg">
            Founded in 2014, HueEstate began with a simple observation static
            blueprints fail to capture the true atmosphere of a home. What
            started as a boutique architectural studio has evolved into a
            digital visualizer platform engineered to bridge high end interior
            craftsmanship with real time room previewing.
          </p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-[#243D35]/15 self-end">
          {stats.map((s) => (
            <div key={s.id} className="px-3 first:pl-0 sm:px-6 md:px-8">
              <dd className="text-3xl font-semibold tracking-tight text-[#243D35] sm:text-5xl lg:text-6xl">
                {s.value}
              </dd>
              <dt className="mt-2 text-xs text-[#243D35]/70 sm:text-sm md:text-base">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
