import Image from "next/image";
export default function AboutUsHero() {
  return (
    <section className="font-poppins">
      <div className="relative h-[55vh] w-full sm:h-[60vh] md:h-[68vh]">
        <Image
          fill
          priority
          sizes="100vw"
          src={"/herro.png"}
          alt="About Us Hero Background Image"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-[#243D35]/50 via-transparent to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-5 text-xs uppercase tracking-wide text-white sm:text-sm">
          <span className="md:text-xl">Since 2014</span>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden bg-white px-4 md:px-12">
        <h1 className="select-none pt-4 text-left text-[19vw] font-semibold leading-[0.85] tracking-tighter text-[#243D35] md:-mt-7 md:pt-0 md:text-[18vw] lg:text-[15vw]">
          About Us
        </h1>
      </div>
    </section>
  );
}
