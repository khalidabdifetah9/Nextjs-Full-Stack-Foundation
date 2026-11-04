import Image from "next/image";

export default function Hero() {
  return (
    <section>
      <div className="@container rounded-t-md pt-5 overflow-hidden">
        <div className="flex justify-between">
          <p className="w-full max-w-sm font-poppins text-base tracking-wider text-[#243D35] sm:max-w-md sm:text-xl md:w-99 md:max-w-none md:text-2xl">
            Discover thoughtfully designed homes and make every space reflect
            your style, before you even move in
          </p>

          <div className="hidden w-40 md:block" aria-hidden="true" />
        </div>

        <h1 className="mt-8 select-none text-right text-[19cqw] font-semibold leading-[0.85] tracking-tighter text-[#243D35] sm:mt-10 md:-mt-30 md:text-[18vw] lg:text-[15vw]">
          HueEstate
        </h1>
      </div>

      <div className="relative h-[55vh] w-full sm:h-[65vh] md:h-[75vh]">
        <Image
          fill
          priority
          sizes="100vw"
          src={"/herro.png"}
          alt="women relaxing in her house"
          className="object-cover rounded-b-md"
        />
      </div>
    </section>
  );
}