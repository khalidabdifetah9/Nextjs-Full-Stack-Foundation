const pillars = [
  {
    id: "clarity",
    title: "Clarity",
    text: "Every space should be easy to understand, from its layout to its palette, so you can decide with confidence.",
  },
  {
    id: "craft",
    title: "Craft",
    text: "We obsess over materials, proportions, and finishes, because lasting homes are built on small details.",
  },
  {
    id: "personal",
    title: "Personal",
    text: "A home should feel unmistakably yours. Our tools put your taste first, not a template.",
  },
];

export default function OurVision() {
  return (
    <section id="vision" className="my-10 font-poppins md:my-22 lg:my-40">
      {/* Top: tag + statement */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2.5fr] lg:gap-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60 sm:text-sm">
        </p>
        <h2 className="text-3xl font-medium leading-tight text-[#243D35] sm:text-4xl lg:text-5xl">
          A world where everyone can shape the space they live in, with
          confidence and without compromise.
        </h2>
      </div>

      <div className="mt-12 grid border-t border-[#243D35]/15 md:mt-20 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.id}
            className="border-b border-[#243D35]/15 py-8 md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
          >
            
            <h3 className="mt-6 text-2xl font-semibold text-[#243D35] md:mt-10">
              {pillar.title}
            </h3>
            <p className="mt-3 max-w-sm text-base text-[#243D35]/70 md:text-lg">
              {pillar.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}