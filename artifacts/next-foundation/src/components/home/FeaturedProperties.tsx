import Image from "next/image";
import featuredProperties from "@/lib/properties";
export default function FeaturedProperties() {
  return (
    <section className="mt-32">
      <header className="text-center">
        <h1 className="font-bold text-[4vw] text-[#243D35]">
          Architectures Ready For Your Touch
        </h1>
        <p className="text-2xl m text-[#243D35]">
          Explore white canvas residences engineered for real time interior
          personalization. Select a structure, test custom room palettes, and
          find your ideal space
        </p>
      </header>
      <div className="grid grid-cols-2 gap-7">
        {featuredProperties.map((properties) => (
          <div className="flex flex-col" key={properties.id}>
            <div className="w-full relative h-150">
              <Image
                src={properties.src}
                alt={properties.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center">
              <h3 className="font-bold text-[#243D35]">{properties.label}</h3>
              <p>
                <span>{properties.location}</span>
                <span>{properties.features.sqft} Sqft</span>
                <span>{properties.features.bedrooms} Bedrooms</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
