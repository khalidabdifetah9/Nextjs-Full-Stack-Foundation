const faqs = [
  {
    id: "canvas",
    question: "What is a white canvas residence?",
    answer:
      "A finished, move in ready structure with neutral walls and floors, built so you can personalize every room without tearing anything out.",
  },
  {
    id: "palettes",
    question: "How do real time room palettes work?",
    answer:
      "Pick a room, choose a palette, and see wall shades, finishes, and accents update instantly before you commit to a single change.",
  },
  {
    id: "cost",
    question: "Is the AI design assistant free to use?",
    answer:
      "Yes. Creating an account and testing palettes is free. You only pay when you decide to move forward with a property.",
  },
  {
    id: "support",
    question: "Can I speak to a designer before deciding?",
    answer:
      "Absolutely. Book a free consultation and a designer will walk you through layouts, materials, and next steps.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mt-20 md:mt-22 lg:mt-30 font-poppins">
      <header className="mb-10 max-w-2xl space-y-4 md:mb-16 md:space-y-6">
        <h2 className="text-3xl font-semibold leading-tight text-[#243D35] sm:text-4xl lg:text-5xl">
          Questions, answered
        </h2>
        <p className="text-base text-[#243D35]/80 sm:text-lg md:text-xl">
          Everything you need to know before shaping your space.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 md:gap-7 md:pb-12">
        {faqs.map((faq, index) => (
          <article
            key={faq.id}
            tabIndex={0}
            className={`group flex flex-col justify-between gap-10 border border-[#243D35]/20 bg-[#F7F6F2] p-6 text-[#243D35] outline-none transition-colors duration-500 hover:bg-[#243D35] hover:text-[#F7F6F2] focus-visible:bg-[#243D35] focus-visible:text-[#F7F6F2] md:h-80 md:p-8 ${
              index % 2 === 1 ? "md:translate-y-12" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm opacity-60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
                className="transition-transform duration-500 md:group-hover:rotate-45 md:group-focus-visible:rotate-45"
              >
                <path d="M10 3v14M3 10h14" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-medium leading-snug sm:text-2xl">
                {faq.question}
              </h3>
              <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                <div className="min-h-0 overflow-hidden">
                  <p className="pt-4 text-base opacity-80 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-80 md:group-focus-visible:opacity-80">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}