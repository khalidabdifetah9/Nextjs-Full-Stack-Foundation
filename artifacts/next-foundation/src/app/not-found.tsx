import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src={"/404_bg.png"}
        alt="socket plug detaching"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right md:object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-white/95 via-white/90 to-white/95 lg:hidden"
      />

      <div className="absolute inset-x-0 top-0 z-10 max-w-400 px-6 pt-20 sm:px-10 sm:pt-28 md:px-14 md:pt-32 lg:inset-x-auto lg:left-20 lg:top-0 lg:px-22 lg:pt-0">
        <h1 className="text-[30vw] font-bold leading-none sm:text-[24vw] md:text-[18vw] lg:text-[13vw] lg:leading-normal">
          404
        </h1>
        <h2 className="mt-2 font-poppins text-3xl font-bold capitalize sm:text-4xl md:text-5xl lg:mt-0 lg:text-[3vw]">
          page not found
        </h2>
        <p className="mb-8 mt-4 max-w-md font-poppins text-base sm:max-w-lg sm:text-lg md:mb-10 md:max-w-xl lg:mt-0 lg:mb-12 lg:max-w-160">
          This page didn&apos;t want to leave its house today and honestly, we
          can&apos;t blame it. It&apos;s staying in, drinking coffee, and
          ignoring all incoming requests. Let&apos;s head back before it gets
          awkward.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:gap-0 lg:space-x-8">
          <Link
            href={"/"}
            className="rounded-md bg-[#243D35] px-8 py-4 text-center font-poppins text-lg text-white shadow-sm sm:px-10 lg:px-12"
          >
            Back to Home
          </Link>
          <Link
            href={"/dashboard"}
            className="rounded-md bg-white px-8 py-4 text-center font-poppins text-lg text-black shadow-md sm:px-10 lg:px-12"
          >
            Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
}