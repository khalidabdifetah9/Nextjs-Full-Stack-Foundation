import Image from "next/image";
import featuredProperties from "@/lib/properties";
import Link from "next/link";

export default function FeaturedProperties() {
  return (
    <section id="properties" className="mt-20 scroll-mt-24 md:mt-32 lg:mt-50">
      <header className="space-y-4 md:space-y-6 max-w-300 mx-auto text-center mb-10 md:mb-20 px-4">
        <h2 className="font-bold leading-tighter text-3xl sm:text-4xl lg:text-[4vw] text-[#243D35]">
          Architectures Ready For Your Touch
        </h2>
        <p className="text-base font-poppins sm:text-xl md:text-2xl text-[#243D35]/80">
          Explore white canvas residences engineered for real time interior
          personalization. Select a structure, test custom room palettes, and
          find your ideal space
        </p>
      </header>

      <div className="grid grid-cols-1 font-poppins md:grid-cols-2 gap-x-7 gap-y-10">
        {featuredProperties.map((properties) => (
          <div
            key={properties.id}
            className="flex flex-col space-y-4 md:space-y-5
              md:last:odd:col-span-2
              md:last:odd:justify-self-center
              md:last:odd:w-[calc(50%-0.875rem)]"
          >
            <Link
              href={properties.slug}
              className="group w-full overflow-hidden relative h-80 sm:h-112 md:h-150"
            >
              <Image
                src={properties.src}
                alt={properties.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover md:group-hover:blur-sm md:group-hover:scale-[1.08] group-focus-visible:blur-sm transition-all duration-600"
              />

              {/* "View" label: always visible on mobile (no hover on touch), hover-reveal on md+ */}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span
                  className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-md
                    opacity-100 translate-y-0 scale-100
                    md:opacity-0 md:translate-y-4 md:scale-90
                    transition-all duration-500
                    md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:scale-100
                    group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100"
                >
                  [ View ]
                </span>
              </span>
            </Link>

            {/* Title + meta */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8 px-1">
              <h3 className="font-bold text-xl md:text-2xl text-[#243D35] sm:whitespace-nowrap">
                {properties.label}
              </h3>
              <ul className="flex flex-wrap items-center gap-y-1 divide-x divide-[#243D35]/30 text-sm md:text-base text-[#243D35]/70">
                <li className="pr-3 md:pr-4">{properties.location}</li>
                <li className="px-3 md:px-4">
                  {properties.features.sqft} Sqft
                </li>
                <li className="pl-3 md:pl-4">
                  {properties.features.bedrooms} Bedrooms
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
