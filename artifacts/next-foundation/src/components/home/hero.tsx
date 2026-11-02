import Image from "next/image";

export default function Hero() {
  return (
    <section>
      <div className="rounded-t-md pt-5 overflow-hidden">
        <div className="flex justify-between">
          <p className="w-90 font-poppins text-2xl leading-tight text-[#243D35]">
            Discover thoughtfully designed homes and make every space reflect
            your style, before you even move in
          </p>

          <div className="w-40" aria-hidden="true" />
        </div>

        <h1 className="select-none text-right text-[22vw] font-semibold leading-[0.85] tracking-tighter text-[#243D35] md:text-[18vw] lg:text-[15vw] ">
          HueEstate
        </h1>
      </div>

      <div className="relative w-full h-[75vh]">
        <Image
          fill
          priority
          src={"/herro.png"}
          alt="women relaxing in her house"
          className="object-cover rounded-b-md"
        />
      </div>
    </section>
  );
}
